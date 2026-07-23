<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('payments:remind {estate?} {--all}', function (?string $estate) {
    /** @var \App\Services\TermiiSms $sms */
    $sms = app(\App\Services\TermiiSms::class);

    $period = now()->format('Y-m');
    $estates = $this->option('all')
        ? \App\Models\Estate::all()
        : \App\Models\Estate::when($estate, fn ($q, $id) => $q->where('id', $id))->get();

    if ($estates->isEmpty()) {
        $this->error('No estates found.');
        return;
    }

    $totalSent = 0;

    foreach ($estates as $estateModel) {
        $paidTenantIds = \App\Models\Payment::where('estate_id', $estateModel->id)
            ->where('period', $period)
            ->where('status', 'paid')
            ->pluck('tenant_id');

        $pendingTenants = $estateModel->tenants()
            ->where('status', 'active')
            ->whereNotIn('id', $paidTenantIds)
            ->get();

        if ($pendingTenants->isEmpty()) {
            $this->line("All tenants in {$estateModel->name} have paid for {$period}.");
            continue;
        }

        $this->line("Sending reminders for {$estateModel->name} ({$pendingTenants->count()} pending)...");

        foreach ($pendingTenants as $tenant) {
            $amount = number_format($tenant->rent_amount);
            $formattedPeriod = \Carbon\Carbon::parse($period . '-01')->format('F Y');

            $message = "Hi {$tenant->name}, this is a reminder that your estate dues of ₦{$amount} for {$formattedPeriod} is still pending. " .
                       "Please make payment to {$estateModel->name}. " .
                       "Contact {$estateModel->chairman_name} at {$estateModel->chairman_phone} for questions. - EstatePay";

            if ($sms->send($tenant->phone, $message)) {
                $this->line("  Sent to {$tenant->name} ({$tenant->phone})");
                $totalSent++;
            } else {
                $this->error("  Failed to send to {$tenant->name} ({$tenant->phone})");
            }
        }
    }

    $this->newLine();
    $this->info("Done. {$totalSent} reminder(s) sent.");
})->purpose('Send SMS payment reminders to tenants with pending payments');
