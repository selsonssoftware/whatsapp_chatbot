<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Scopes\CompanyScope;
use App\Support\Role;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'languages',
        'profile',
        'user_address',
        'company_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'pwd',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'languages' => 'array',   // Automatically converts JSON string to array
        'status' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    /**
     * Restrict every tenant owned query to the company of the signed in
     * admin. Super admins manage every company and are never filtered.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * The account is active unless it was explicitly suspended.
     */
    public function isActive(): bool
    {
        return (bool) $this->status;
    }

    public function isSuperAdmin(): bool
    {
        return Role::isSuperAdmin((string) $this->role);
    }

    public function isAdmin(): bool
    {
        return Role::isAdmin((string) $this->role);
    }

    /**
     * The safe representation for API responses. Password hashes, tokens and
     * secrets are never included.
     *
     * @return array<string, mixed>
     */
    public function toSafeArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'status' => (bool) $this->status,
            'company_id' => $this->company_id,
            'last_login_at' => optional($this->last_login_at)->toISOString(),
        ];
    }
}
