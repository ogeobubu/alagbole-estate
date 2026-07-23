<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackService
{
    protected string $secretKey;
    protected string $baseUrl = 'https://api.paystack.co';

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret_key');
    }

    public function initializeTransaction(string $email, int $amount, array $metadata = []): ?array
    {
        try {
            $response = Http::withToken($this->secretKey)
                ->post("{$this->baseUrl}/transaction/initialize", [
                    'email' => $email,
                    'amount' => $amount,
                    'callback_url' => config('services.paystack.callback_url'),
                    'metadata' => $metadata,
                ]);

            if ($response->successful()) {
                return $response->json('data');
            }

            Log::error('Paystack initialize failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Paystack initialize exception', [
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function verifyTransaction(string $reference): ?array
    {
        try {
            $response = Http::withToken($this->secretKey)
                ->get("{$this->baseUrl}/transaction/verify/{$reference}");

            if ($response->successful()) {
                return $response->json('data');
            }

            Log::error('Paystack verify failed', [
                'reference' => $reference,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Paystack verify exception', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function verifyWebhook(string $payload, string $signature): bool
    {
        $expected = hash_hmac('sha512', $payload, $this->secretKey);
        return hash_equals($expected, $signature);
    }
}
