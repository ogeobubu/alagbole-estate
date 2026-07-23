<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $plainPassword,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Welcome to EstatePay - Account Created")
            ->greeting("Welcome, {$notifiable->name}!")
            ->line("Your EstatePay account has been created successfully.")
            ->line("**Email:** {$notifiable->email}")
            ->line("**Password:** {$this->plainPassword}")
            ->line("You can now log in at the link below.")
            ->line("**Important:** For security, please change your password after your first login.")
            ->action('Login to EstatePay', config('app.url'))
            ->line("If you have any questions, please contact your administrator.");
    }
}
