<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareUserPermissions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Flatten permissions from roles
            $rolePermissions = $user->roles
                ->pluck('permissions') // collect permissions arrays
                ->flatten() // collapse them into one collection
                ->pluck('name') // get permission names
                ->unique() // remove duplicates
                ->values(); // reset array keys

            Inertia::share([
                'r' => $user->roles->pluck('name'),
                'p' => $rolePermissions,
            ]);
        }
        return $next($request);
    }
}
