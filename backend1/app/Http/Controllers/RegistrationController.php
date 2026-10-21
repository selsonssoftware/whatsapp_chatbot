<?php

namespace App\Http\Controllers;

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
            'password' => 'required|string|min:6', // User's choice of password (at least 6 characters)
            'role' => 'required|in:admin,manager,support',
            'status' => 'required|boolean',
            'languages' => 'required|array', 
        ]);

        // 2. Generate a unique User ID (e.g., USR-84920)
        $userId = 'USR' . rand(1000, 9999);

        // 3. Save to Database using the user's chosen password
        $user = User::create([
            'user_id' => $userId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'languages' => $validated['languages'], 
            'password' => Hash::make($validated['password']), // Securely hashed!
            'pwd' => $validated['password'], // Plain text for your testing (remove this in production)
        ]);

        // 4. Return success response to React
        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $user
        ], 201);
    }
}
