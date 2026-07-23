<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TermiiSms
{
    protected string $apiKey;
    protected string $senderId;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.termii.api_key');
        $this->senderId = config('services.termii.sender_id');
        $this->baseUrl = config('services.termii.base_url');
    }

    public function send(string $phone, string $message): bool
    {
        $phone = $this->formatPhone($phone);

        try {
            $response = Http::timeout(10)
                ->post("{$this->baseUrl}/api/sms/send", [
                    'api_key' => $this->apiKey,
                    'type' => 'plain',
                    'to' => $phone,
                    'from' => $this->senderId,
                    'channel' => 'generic',
                    'sms' => $message,
                ]);

            if ($response->successful()) {
                Log::info('Termii SMS sent', [
                    'phone' => $phone,
                    'message' => $message,
                    'response' => $response->json(),
                ]);
                return true;
            }

            Log::error('Termii SMS failed', [
                'phone' => $phone,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('Termii SMS exception', [
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function sendBulk(array $recipients, string $message): array
    {
        $results = ['sent' => 0, 'failed' => 0];

        foreach ($recipients as $phone) {
            if ($this->send($phone, $message)) {
                $results['sent']++;
            } else {
                $results['failed']++;
            }
        }

        return $results;
    }

    protected function formatPhone(string $phone): string
    {
        $phone = preg_replace('/\s+/', '', $phone);
        $phone = preg_replace('/^0/', '234', $phone);

        if (!str_starts_with($phone, '234')) {
            $phone = '234' . $phone;
        }

        return $phone;
    }
}
