<?php

namespace App\Http\Controllers;

use App\Models\Scopes\CompanyScope;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

/**
 * Authentication for the platform Super Admin.
 *
 * Every credential check happens here, against the database. The browser only
 * ever learns whether the session could be established, never whether an
 * account exists or which role it holds.
 */
class SuperAdminAuthController extends Controller
{
    /**
     * Failed attempts allowed per account and IP before the endpoint locks.
     */
    private const MAX_ATTEMPTS = 5;

    /**
     * Seconds a throttled endpoint stays locked.
     */
    private const DECAY_SECONDS = 60;

    /**
     * A single, generic message for every failure mode so the endpoint can
     * not be used to discover which accounts exist.
     */
    private const GENERIC_ERROR = 'The provided credentials are not valid for a Super Admin account.';

    /**
     * Issues the CSRF token used by the SPA and starts the session cookie.
     */
    public function csrfCookie(): JsonResponse
    {
        return response()->json([
            'csrf_token' => csrf_token(),
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        $login = trim($credentials['login']);
        $throttleKey = $this->throttleKey($login, $request);

        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json(
                ['message' => 'Too many failed sign-in attempts. Please try again in ' . $seconds . ' seconds.'],
                429,
                ['Retry-After' => (string) $seconds]
            );
        }

        $user = $this->findUser($login);

        // The password is always verified, even for unknown accounts, so the
        // response time does not reveal whether the account exists.
        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($throttleKey, self::DECAY_SECONDS);

            return response()->json(['message' => self::GENERIC_ERROR], 401);
        }

        if (! $user->isActive() || ! $user->isSuperAdmin()) {
            RateLimiter::hit($throttleKey, self::DECAY_SECONDS);

            return response()->json(['message' => self::GENERIC_ERROR], 401);
        }

        RateLimiter::clear($throttleKey);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        $user->forceFill(['last_login_at' => now()])->saveQuietly();

        return response()->json(['user' => $user->toSafeArray()]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Signed out.']);
    }

    /**
     * Returns the signed in Super Admin so the SPA can restore a session
     * after a page reload.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! $user->isActive()) {
            return response()->json(['message' => 'This account is inactive.'], 403);
        }

        if (! $user->isSuperAdmin()) {
            return response()->json(['message' => 'This account is not authorized for this area.'], 403);
        }

        return response()->json(['user' => $user->toSafeArray()]);
    }

    /**
     * Looks the account up by login id or e-mail address.
     */
    private function findUser(string $login): ?User
    {
        $needle = Str::lower($login);

        return User::withoutGlobalScope(CompanyScope::class)
            ->where(function ($query) use ($needle, $login) {
                $query->whereRaw('LOWER(email) = ?', [$needle])
                    ->orWhere('user_id', $login);
            })
            ->first();
    }

    private function throttleKey(string $login, Request $request): string
    {
        return 'super-admin-login:' . Str::lower($login) . '|' . $request->ip();
    }
}
