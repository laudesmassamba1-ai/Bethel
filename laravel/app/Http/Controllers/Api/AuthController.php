<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = Str::random(80);
        $user->forceFill([
            'api_token' => hash('sha256', $token),
            'remember_token' => ($validated['remember'] ?? false) ? Str::random(60) : null,
        ])->save();

        Auth::guard('web')->login($user, $validated['remember'] ?? false);

        return response()->json([
            'token' => $token,
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'remember' => $validated['remember'] ?? false,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => [
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
        ]]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->forceFill(['api_token' => null, 'remember_token' => null])->save();
        Auth::guard('web')->logout();

        return response()->json(['message' => 'Deconnecte']);
    }
}
