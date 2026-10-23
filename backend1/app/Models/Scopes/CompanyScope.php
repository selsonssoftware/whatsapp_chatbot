<?php

namespace App\Models\Scopes;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

/**
 * Company level data isolation.
 *
 * Every tenant owned row belongs to a company. An `admin` may only ever see
 * the rows of the company they belong to, while a `super_admin` manages the
 * whole platform and therefore sees every company.
 *
 * The scope stays dormant while nobody is authenticated so the credential
 * lookup performed by the login endpoint is never filtered.
 */
class CompanyScope implements Scope
{
    /**
     * Bypass the scope (authentication lookups, platform wide maintenance).
     */
    public static bool $bypassed = false;

    public static function bypass(): void
    {
        static::$bypassed = true;
    }

    public static function unBypass(): void
    {
        static::$bypassed = false;
    }

    public function apply(Builder $builder, Model $model): void
    {
        if (static::$bypassed) {
            return;
        }

        $user = Auth::user();

        if (! $user instanceof User) {
            return;
        }

        if ($user->isSuperAdmin()) {
            return;
        }

        $builder->where($model->qualifyColumn('company_id'), $user->company_id);
    }
}
