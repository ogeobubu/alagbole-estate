<?php

namespace App\Notifications;

use App\Models\Estate;
use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTenantRegistered extends Notification
{
    use Queueable;

    public function __construct(
        public Tenant $tenant,
        public Estate $estate,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $amount = number_format($this->tenant->rent_amount, 2);

        return (new MailMessage)
            ->subject("New Tenant Added - {$this->estate->name}")
            ->greeting("New tenant registered!")
            ->line("A new tenant has been added to **{$this->estate->name}**.")
            ->line("**Name:** {$this->tenant->name}")
            ->line("**Apartment:** {$this->tenant->apartment_number}")
            ->line("**Rent:** ₦{$amount}")
            ->line("**Phone:** {$this->tenant->phone}")
            ->line("**Email:** " . ($this->tenant->email ?? 'Not provided'))
            ->line("**Status:** " . ucfirst($this->tenant->status))
            ->action('View Tenant', route('estates.tenants.show', [$this->estate->id, $this->tenant->id]));
    }
}
