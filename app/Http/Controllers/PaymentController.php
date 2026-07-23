<?php

namespace App\Http\Controllers;

use App\Models\Estate;
use App\Models\Payment;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
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
