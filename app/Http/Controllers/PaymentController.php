<?php

namespace App\Http\Controllers;

use App\Models\Estate;
use App\Models\Payment;
use App\Models\Tenant;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        protected PaystackService $paystack,
    ) {}

    public function index(Estate $estate)
    {
        $this->authorizeEstate($estate);

        $payments = Payment::where('estate_id', $estate->id)
            ->with('tenant')
            ->latest('period')
            ->latest()
            ->get();

        $periods = Payment::where('estate_id', $estate->id)
            ->select('period')
            ->distinct()
            ->orderByDesc('period')
            ->pluck('period');

        return Inertia::render('Payments/Index', [
            'estate' => $estate,
            'payments' => $payments,
            'periods' => $periods,
        ]);
    }

    public function create(Estate $estate, ?Tenant $tenant = null)
    {
        $this->authorizeEstate($estate);

        $tenants = $estate->tenants()->where('status', 'active')->orderBy('apartment_number')->get();
        $currentPeriod = now()->format('Y-m');

        return Inertia::render('Payments/Create', [
            'estate' => $estate,
            'tenants' => $tenants,
            'selectedTenant' => $tenant,
            'currentPeriod' => $currentPeriod,
            'paystackPublicKey' => config('services.paystack.public_key'),
        ]);
    }

    public function store(Request $request, Estate $estate)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'amount' => 'required|numeric|min:0',
            'period' => 'required|string',
            'payment_method' => 'nullable|string',
            'transaction_reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $tenant = Tenant::findOrFail($validated['tenant_id']);

        if ($tenant->estate_id !== $estate->id) {
            abort(403);
        }

        $existing = Payment::where('tenant_id', $tenant->id)
            ->where('period', $validated['period'])
            ->first();

        if ($existing) {
            return back()->withErrors([
                'period' => 'A payment for this period already exists for this tenant.',
            ]);
        }

        $payment = $estate->payments()->create([
            ...$validated,
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return redirect()->route('estates.show', $estate)
            ->with('success', 'Payment recorded successfully!');
    }

    public function show(Estate $estate, Payment $payment)
    {
        $this->authorizeEstate($estate);

        $payment->load(['tenant', 'estate']);

        return Inertia::render('Payments/Show', [
            'estate' => $estate,
            'payment' => $payment,
        ]);
    }

    public function markPaid(Request $request, Estate $estate, Payment $payment)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'payment_method' => 'required|string',
            'transaction_reference' => 'nullable|string',
        ]);

        $payment->markAsPaid(
            $validated['payment_method'],
            $validated['transaction_reference'] ?? null,
        );

        return back()->with('success', 'Payment marked as paid!');
    }

    public function generatePeriodPayments(Request $request, Estate $estate)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'period' => 'required|string',
        ]);

        $period = $validated['period'];
        $tenants = $estate->tenants()->where('status', 'active')->get();
        $created = 0;

        foreach ($tenants as $tenant) {
            $exists = Payment::where('tenant_id', $tenant->id)
                ->where('period', $period)
                ->exists();

            if (!$exists) {
                Payment::create([
                    'tenant_id' => $tenant->id,
                    'estate_id' => $estate->id,
                    'amount' => $tenant->rent_amount,
                    'period' => $period,
                    'status' => 'pending',
                ]);
                $created++;
            }
        }

        return back()->with('success', "{$created} payment(s) generated for {$period}.");
    }

    public function initializePaystack(Estate $estate, Payment $payment)
    {
        $this->authorizeEstate($estate);

        if ($payment->status === 'paid') {
            return back()->withErrors(['payment' => 'This payment is already completed.']);
        }

        $tenant = $payment->tenant;
        $email = $tenant->email ?? Auth::user()->email;

        $reference = 'EPAY-' . strtoupper(bin2hex(random_bytes(8)));
        $payment->update(['transaction_reference' => $reference]);

        $result = $this->paystack->initializeTransaction(
            $email,
            (int) ($payment->amount * 100),
            [
                'payment_id' => $payment->id,
                'estate_id' => $estate->id,
                'period' => $payment->period,
                'tenant_name' => $tenant->name,
                'apartment' => $tenant->apartment_number,
            ]
        );

        if (!$result) {
            return back()->withErrors(['payment' => 'Failed to initialize Paystack payment. Please try again.']);
        }

        return response()->json([
            'authorization_url' => $result['authorization_url'],
            'reference' => $result['reference'],
        ]);
    }

    public function paystackCallback(Request $request)
    {
        $reference = $request->query('reference');

        if (!$reference) {
            return redirect()->route('dashboard')
                ->withErrors(['payment' => 'No payment reference provided.']);
        }

        $verification = $this->paystack->verifyTransaction($reference);

        if (!$verification || $verification['status'] !== 'success') {
            return redirect()->route('dashboard')
                ->withErrors(['payment' => 'Payment verification failed.']);
        }

        $metadata = $verification['metadata'] ?? [];
        $paymentId = $metadata['payment_id'] ?? null;

        if ($paymentId) {
            $payment = Payment::find($paymentId);
            if ($payment) {
                $payment->markAsPaid('paystack', $reference);

                Log::info('Paystack payment verified', [
                    'payment_id' => $paymentId,
                    'reference' => $reference,
                    'amount' => $verification['amount'] / 100,
                ]);
            }
        }

        $estateId = $metadata['estate_id'] ?? null;
        $redirectUrl = $estateId
            ? route('estates.payments.index', $estateId)
            : route('dashboard');

        return redirect($redirectUrl)
            ->with('success', 'Payment completed successfully!');
    }

    public function paystackWebhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('x-paystack-signature');

        if (!$this->paystack->verifyWebhook($payload, $signature)) {
            Log::warning('Paystack webhook: invalid signature');
            return response('Invalid signature', 400);
        }

        $event = json_decode($payload, true);

        if ($event['event'] === 'charge.success') {
            $data = $event['data'];
            $reference = $data['reference'];
            $metadata = $data['metadata'] ?? [];
            $paymentId = $metadata['payment_id'] ?? null;

            if ($paymentId) {
                $payment = Payment::find($paymentId);
                if ($payment && $payment->status !== 'paid') {
                    $payment->markAsPaid('paystack', $reference);

                    Log::info('Paystack webhook: payment marked paid', [
                        'payment_id' => $paymentId,
                        'reference' => $reference,
                    ]);
                }
            }
        }

        return response('OK', 200);
    }

    public function destroy(Estate $estate, Payment $payment)
    {
        $this->authorizeEstate($estate);

        $payment->delete();

        return back()->with('success', 'Payment deleted.');
    }

    private function authorizeEstate(Estate $estate): void
    {
        if ($estate->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
