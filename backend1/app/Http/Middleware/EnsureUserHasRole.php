<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Server side role authorization.
 *
 * The role is always read from the authenticated database record, never from
 * a request parameter or a client supplied flag.
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! $user->isActive()) {
            return response()->json(['message' => 'This account is inactive.'], 403);
        }

        if (! in_array((string) $user->role, $roles, true)) {
            return response()->json(['message' => 'This account is not authorized for this area.'], 403);
        }

        return $next($request);
    }
}
