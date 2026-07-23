<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    public function estate(): HasOne
    {
        return $this->hasOne(Estate::class);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function isAdmin(): bool
    {
        return $this->is_admin;
    }

    public function hasRole(string $slug): bool
    {
        return $this->roles()->where('slug', $slug)->exists();
    }

    public function hasAnyRole(array $slugs): bool
    {
        return $this->roles()->whereIn('slug', $slugs)->exists();
    }

    public function hasPermission(string $slug): bool
    {
        if ($this->is_admin) {
            return true;
        }

        return $this->roles()
            ->whereHas('permissions', fn ($q) => $q->where('slug', $slug))
            ->exists();
    }

    public function hasAnyPermission(array $slugs): bool
    {
        if ($this->is_admin) {
            return true;
        }

        return $this->roles()
            ->whereHas('permissions', fn ($q) => $q->whereIn('slug', $slugs))
            ->exists();
    }

    public function getPermissions(): \Illuminate\Support\Collection
    {
        if ($this->is_admin) {
            return Permission::all();
        }

        return Permission::whereHas('roles', fn ($q) => $q->whereIn('id', $this->roles()->pluck('roles.id')))->get();
    }
}
