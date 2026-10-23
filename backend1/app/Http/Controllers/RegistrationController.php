<?php

namespace App\Http\Controllers;

use App\Support\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
class RegistrationController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validate the incoming React data (Added 'password')
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8',
            'status' => 'required|boolean',
            'languages' => 'required|array',
        ]);

        // 2. Generate a unique User ID (e.g., USR-84920)
        $userId = $this->uniqueUserId();

        // 3. Save to Database using the user's chosen password.
        //    The role is assigned by the server: a public registration can
        //    never create a Super Admin account.
        $user = User::create([
            'user_id' => $userId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => Role::ADMIN,
            'status' => $validated['status'],
            'languages' => $validated['languages'],
            'password' => Hash::make($validated['password']), // Securely hashed!
        ]);

        // 4. Return success response to React (never the password hash)
        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $user->toSafeArray()
        ], 201);
    }

    /**
     * Generates a user id that is not used by another account yet.
     */
    private function uniqueUserId(): string
    {
        do {
            $userId = 'USR' . random_int(10000, 99999);
        } while (User::where('user_id', $userId)->exists());

        return $userId;
    }
}
