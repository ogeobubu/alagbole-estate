<?php

namespace App\Console\Commands;

use App\Models\Estate;
use App\Models\Payment;
use App\Services\TermiiSms;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendPaymentReminders extends Command
{
    protected $signature = 'payments:remind
                            {estate? : The estate ID to send reminders for}
                            {--all : Send reminders for all estates}';

    protected $description = 'Send SMS payment reminders to tenants with pending payments';

    public function handle(TermiiSms $sms): int
    {
        $period = now()->format('Y-m');
        $estates = $this->option('all')
            ? Estate::all()
            : Estate::when($this->argument('estate'), fn ($q, $id) => $q->where('id', $id))
                ->get();

        if ($estates->isEmpty()) {
            $this->error('No estates found.');
            return self::FAILURE;
        }

        $totalSent = 0;

        foreach ($estates as $estate) {
            $paidTenantIds = Payment::where('estate_id', $estate->id)
                ->where('period', $period)
                ->where('status', 'paid')
                ->pluck('tenant_id');

            $pendingTenants = $estate->tenants()
                ->where('status', 'active')
                ->whereNotIn('id', $paidTenantIds)
                ->get();

            if ($pendingTenants->isEmpty()) {
                $this->line("All tenants in {$estate.name} have paid for {$period}.");
                continue;
            }

            $this->line("Sending reminders for {$estate.name} ({$pendingTenants->count()} pending)...");

            foreach ($pendingTenants as $tenant) {
                $message = $this->buildReminderMessage($tenant, $estate, $period);

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
        return self::SUCCESS;
    }

    protected function buildReminderMessage($tenant, $estate, string $period): string
    {
        $amount = number_format($tenant->rent_amount);
        $formattedPeriod = Carbon\Carbon::parse($period . '-01')->format('F Y');

        return "Hi {$tenant->name}, this is a reminder that your estate dues of ₦{$amount} for {$formattedPeriod} is still pending. " .
               "Please make payment to {$estate.name} via bank transfer or online. " .
               "Contact {$estate->chairman_name} at {$estate->chairman_phone} for questions. - EstatePay";
    }
}
