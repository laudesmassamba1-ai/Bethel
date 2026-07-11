<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Non authentifie'], 401);
        }

        $tokenAgeMinutes = now()->diffInMinutes($user->created_at);

        $maxLifetime = $user->remember_token
            ? 30 * 24 * 60
            : 24 * 60;

        if ($tokenAgeMinutes > $maxLifetime) {
            $user->forceFill(['api_token' => null])->save();
            return response()->json(['message' => 'Session expiree, reconnectez-vous'], 401);
        }

        return $next($request);
    }
}
