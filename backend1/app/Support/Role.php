<?php

namespace App\Support;

/**
 * Platform roles supported during the current development phase.
 *
 * Only two roles exist today:
 *  - super_admin: manages the platform itself (companies, plans, subscriptions,
 *    company level feature permissions).
 *  - admin: manages the CRM resources of a single company.
 */
final class Role
{
    public const SUPER_ADMIN = 'super_admin';

    public const ADMIN = 'admin';

    /**
     * Every role the platform currently understands.
     *
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [self::SUPER_ADMIN, self::ADMIN];
    }

    public static function isSuperAdmin(?string $role): bool
    {
        return $role === self::SUPER_ADMIN;
    }

    public static function isAdmin(?string $role): bool
    {
        return $role === self::ADMIN;
    }
}
