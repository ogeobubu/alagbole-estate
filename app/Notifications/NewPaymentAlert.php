<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewPaymentAlert extends Notification
{
    use Queueable;

    public function __construct(
        public Payment $payment,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $payment = $this->payment;
        $tenant = $payment->tenant;
        $estate = $payment->estate;
        $amount = number_format($payment->amount, 2);
        $period = \Carbon\Carbon::parse($payment->period . '-01')->format('F Y');

        return (new MailMessage)
            ->subject("New Payment Received - {$tenant->name}")
            ->greeting("New payment alert!")
            ->line("**{$tenant->name}** (Apartment {$tenant->apartment_number}) has made a payment.")
            ->line("**Amount:** ₦{$amount}")
            ->line("**Period:** {$period}")
            ->line("**Method:** " . ucfirst($payment->payment_method))
            ->line("**Reference:** {$payment->transaction_reference}")
            ->line("**Date:** {$payment->paid_at->format('d M Y, h:i A')}")
            ->action('View Payment', route('estates.payments.show', [$estate->id, $payment->id]));
    }
}
