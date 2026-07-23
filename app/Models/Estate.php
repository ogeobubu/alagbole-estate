<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'units_count',
        'monthly_dues_amount',
        'chairman_name',
        'chairman_phone',
        'chairman_email',
        'subscription_status',
        'subscription_trial_ends_at',
    ];

    protected $casts = [
        'monthly_dues_amount' => 'decimal:2',
        'units_count' => 'integer',
        'subscription_trial_ends_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getPaidCountAttribute(): int
    {
        $period = now()->format('Y-m');
        return $this->payments()
            ->where('period', $period)
            ->where('status', 'paid')
            ->distinct('tenant_id')
            ->count('tenant_id');
    }

    public function getPendingCountAttribute(): int
    {
        $period = now()->format('Y-m');
        $paid = $this->payments()
            ->where('period', $period)
            ->where('status', 'paid')
            ->distinct('tenant_id')
            ->count('tenant_id');
        return $this->tenants()->where('status', 'active')->count() - $paid;
    }

    public function getTotalCollectedAttribute(): float
    {
        $period = now()->format('Y-m');
        return (float) $this->payments()
            ->where('period', $period)
            ->where('status', 'paid')
            ->sum('amount');
    }
}
