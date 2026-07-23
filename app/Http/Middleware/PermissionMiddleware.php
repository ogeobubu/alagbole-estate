<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        if ($user->isAdmin()) {
            return $next($request);
        }

        if (!$user->hasAnyPermission($permissions)) {
            abort(403, 'Unauthorized. Required permission: ' . implode(' or ', $permissions));
        }

        return $next($request);
    }
}
