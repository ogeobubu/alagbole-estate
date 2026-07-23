<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmed extends Notification
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
            ->subject("Payment Confirmed - {$estate->name}")
            ->greeting("Hello {$tenant->name},")
            ->line("Your estate dues payment for **{$period}** has been confirmed.")
            ->line("**Amount:** ₦{$amount}")
            ->line("**Estate:** {$estate->name}")
            ->line("**Apartment:** {$tenant->apartment_number}")
            ->line("**Reference:** {$payment->transaction_reference}")
            ->line("**Method:** " . ucfirst($payment->payment_method))
            ->line("**Date:** {$payment->paid_at->format('d M Y, h:i A')}")
            ->line("Thank you for your prompt payment!")
            ->action('View Payment', route('estates.payments.show', [$estate->id, $payment->id]))
            ->line("If you have any questions, contact {$estate->chairman_name} at {$estate->chairman_phone}.");
    }
}
