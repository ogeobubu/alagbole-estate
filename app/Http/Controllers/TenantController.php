<?php

namespace App\Http\Controllers;

use App\Models\Estate;
use App\Models\Payment;
use App\Models\Tenant;
use App\Services\PushNotificationService;
use App\Services\TermiiSms;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index(Estate $estate)
    {
        $this->authorizeEstate($estate);

        $tenants = $estate->tenants()
            ->with('currentPayment')
            ->orderBy('apartment_number')
            ->get();

        return Inertia::render('Tenants/Index', [
            'estate' => $estate,
            'tenants' => $tenants,
        ]);
    }

    public function create(Estate $estate)
    {
        $this->authorizeEstate($estate);

        return Inertia::render('Tenants/Create', [
            'estate' => $estate,
        ]);
    }

    public function store(Request $request, Estate $estate)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'apartment_number' => 'required|string|max:50',
            'rent_amount' => 'required|numeric|min:0',
        ]);

        $tenant = $estate->tenants()->create($validated);

        return redirect()->route('estates.tenants.show', [$estate, $tenant])
            ->with('success', 'Tenant added successfully.');
    }

    public function show(Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        $tenant->load(['payments' => function ($query) {
            $query->latest('period')->limit(12);
        }]);

        return Inertia::render('Tenants/Show', [
            'estate' => $estate,
            'tenant' => $tenant,
        ]);
    }

    public function edit(Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        return Inertia::render('Tenants/Edit', [
            'estate' => $estate,
            'tenant' => $tenant,
        ]);
    }

    public function update(Request $request, Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'apartment_number' => 'required|string|max:50',
            'rent_amount' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,moved_out',
        ]);

        $tenant->update($validated);

        return redirect()->route('estates.tenants.show', [$estate, $tenant])
            ->with('success', 'Tenant updated successfully.');
    }

    public function destroy(Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        $tenant->delete();

        return redirect()->route('estates.tenants.index', $estate)
            ->with('success', 'Tenant removed successfully.');
    }

    public function sendReminder(Estate $estate, Tenant $tenant, TermiiSms $sms, PushNotificationService $push)
    {
        $this->authorizeEstate($estate);

        $period = now()->format('Y-m');
        $formattedPeriod = Carbon::parse($period . '-01')->format('F Y');
        $amount = number_format($tenant->rent_amount);

        $message = "Hi {$tenant->name}, this is a reminder that your estate dues of ₦{$amount} for {$formattedPeriod} is still pending. " .
                   "Please make payment to {$estate->name}. " .
                   "Contact {$estate->chairman_name} at {$estate->chairman_phone} for questions. - EstatePay";

        $smsSent = $sms->send($tenant->phone, $message);
        $pushResult = $push->sendToUser(
            $estate->user_id,
            'Payment Reminder',
            "₦{$amount} dues for {$formattedPeriod} is pending.",
            route('estates.tenants.show', [$estate->id, $tenant->id])
        );

        $parts = [];
        if ($smsSent) $parts[] = 'SMS';
        if ($pushResult['sent'] > 0) $parts[] = 'push notification';

        return back()->with(
            count($parts) > 0 ? 'success' : 'error',
            count($parts) > 0
                ? ucfirst(implode(' and ', $parts)) . " sent to {$tenant->name}"
                : "Failed to send reminder to {$tenant->name}. Please try again."
        );
    }

    public function sendBulkReminders(Estate $estate, TermiiSms $sms, PushNotificationService $push)
    {
        $this->authorizeEstate($estate);

        $period = now()->format('Y-m');
        $formattedPeriod = Carbon::parse($period . '-01')->format('F Y');

        $paidTenantIds = Payment::where('estate_id', $estate->id)
            ->where('period', $period)
            ->where('status', 'paid')
            ->pluck('tenant_id');

        $pendingTenants = $estate->tenants()
            ->where('status', 'active')
            ->whereNotIn('id', $paidTenantIds)
            ->get();

        if ($pendingTenants->isEmpty()) {
            return back()->with('success', 'All tenants have paid for this period!');
        }

        $smsSent = 0;
        foreach ($pendingTenants as $tenant) {
            $amount = number_format($tenant->rent_amount);
            $message = "Hi {$tenant->name}, this is a reminder that your estate dues of ₦{$amount} for {$formattedPeriod} is still pending. " .
                       "Please make payment to {$estate->name}. " .
                       "Contact {$estate->chairman_name} at {$estate->chairman_phone} for questions. - EstatePay";

            if ($sms->send($tenant->phone, $message)) {
                $smsSent++;
            }
        }

        $pushResult = $push->sendToUser(
            $estate->user_id,
            'Payment Reminder',
            "{$pendingTenants->count()} tenants have pending dues for {$formattedPeriod}.",
            route('estates.show', $estate->id)
        );

        return back()->with('success', "{$smsSent} SMS and {$pushResult['sent']} push notification(s) sent.");
    }

    private function authorizeEstate(Estate $estate): void
    {
        if ($estate->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
