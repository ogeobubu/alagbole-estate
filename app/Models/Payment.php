<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'estate_id',
        'amount',
        'period',
        'status',
        'payment_method',
        'transaction_reference',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function estate(): BelongsTo
    {
        return $this->belongsTo(Estate::class);
    }

    public function markAsPaid(string $method = 'bank_transfer', ?string $reference = null): void
    {
        $this->update([
            'status' => 'paid',
            'payment_method' => $method,
            'transaction_reference' => $reference,
            'paid_at' => now(),
        ]);
    }
}
