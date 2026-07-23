<?php

namespace App\Services;

use App\Models\PushToken;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\Notification;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushNotificationService
{
    protected WebPush $webPush;

    public function __construct()
    {
        $this->webPush = new WebPush([
            'VAPID' => [
                'subject' => config('services.vapid.subject'),
                'publicKey' => config('services.vapid.public_key'),
                'privateKey' => config('services.vapid.private_key'),
            ],
        ]);
    }

    public function sendToUser(int $userId, string $title, string $body, ?string $url = null): array
    {
        $tokens = PushToken::where('user_id', $userId)->get();
        $results = ['sent' => 0, 'failed' => 0, 'expired' => 0];

        foreach ($tokens as $token) {
            try {
                $subscription = Subscription::create([
                    'endpoint' => $token->endpoint,
                    'keys' => [
                        'p256dh' => $token->keys_p256dh,
                        'auth' => $token->keys_auth,
                    ],
                ]);

                $payload = json_encode([
                    'title' => $title,
                    'body' => $body,
                    'url' => $url ?? '/',
                    'icon' => '/icon-192.png',
                ]);

                $notification = new Notification($subscription, $payload);
                $report = $this->webPush->sendOneNotification($notification);

                if ($report->isSuccess()) {
                    $results['sent']++;
                    $token->update(['last_used_at' => now()]);
                } else {
                    $results['failed']++;
                    if ($report->isSubscriptionExpired()) {
                        $token->delete();
                        $results['expired']++;
                    }
                }
            } catch (\Exception $e) {
                $results['failed']++;
                Log::error('Push notification failed', [
                    'token_id' => $token->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $results;
    }

    public function sendToAll(string $title, string $body, ?string $url = null): array
    {
        $tokens = PushToken::all();
        $results = ['sent' => 0, 'failed' => 0, 'expired' => 0];

        foreach ($tokens as $token) {
            try {
                $subscription = Subscription::create([
                    'endpoint' => $token->endpoint,
                    'keys' => [
                        'p256dh' => $token->keys_p256dh,
                        'auth' => $token->keys_auth,
                    ],
                ]);

                $payload = json_encode([
                    'title' => $title,
                    'body' => $body,
                    'url' => $url ?? '/',
                ]);

                $report = $this->webPush->sendOneNotification(
                    new Notification($subscription, $payload)
                );

                if ($report->isSuccess()) {
                    $results['sent']++;
                    $token->update(['last_used_at' => now()]);
                } else {
                    $results['failed']++;
                    if ($report->isSubscriptionExpired()) {
                        $token->delete();
                        $results['expired']++;
                    }
                }
            } catch (\Exception $e) {
                $results['failed']++;
            }
        }

        return $results;
    }
}
