<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'estate_id',
        'name',
        'phone',
        'email',
        'apartment_number',
        'rent_amount',
        'status',
    ];

    protected $casts = [
        'rent_amount' => 'decimal:2',
    ];

    public function estate(): BelongsTo
    {
        return $this->belongsTo(Estate::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getCurrentPaymentAttribute(): ?Payment
    {
        $period = now()->format('Y-m');
        return $this->payments()
            ->where('period', $period)
            ->first();
    }
}
