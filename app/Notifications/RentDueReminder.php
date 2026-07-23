<?php

namespace App\Notifications;

use App\Models\Estate;
use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RentDueReminder extends Notification
{
    use Queueable;

    public function __construct(
        public Tenant $tenant,
        public Estate $estate,
        public string $period,
        public float $amount,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $formattedPeriod = \Carbon\Carbon::parse($this->period . '-01')->format('F Y');
        $amount = number_format($this->amount, 2);

        return (new MailMessage)
            ->subject("Payment Reminder - {$this->estate->name}")
            ->greeting("Hello {$this->tenant->name},")
            ->line("This is a friendly reminder that your estate dues for **{$formattedPeriod}** are still pending.")
            ->line("**Amount:** ₦{$amount}")
            ->line("**Estate:** {$this->estate->name}")
            ->line("**Apartment:** {$this->tenant->apartment_number}")
            ->line("Please make your payment as soon as possible to avoid any inconvenience.")
            ->line("Contact {$this->estate->chairman_name} at {$this->estate->chairman_phone} if you have any questions.")
            ->line("Thank you,")
            ->line("**EstatePay Team**");
    }
}
