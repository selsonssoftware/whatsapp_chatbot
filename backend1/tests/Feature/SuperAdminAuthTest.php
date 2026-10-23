<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use App\Support\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SuperAdminAuthTest extends TestCase
{
    use RefreshDatabase;

    private function superAdmin(array $attributes = []): User
    {
        return User::create(array_merge([
            'user_id' => 'USRSUPER',
            'name' => 'Platform Super Admin',
            'email' => 'super.admin@example.com',
            'role' => Role::SUPER_ADMIN,
            'status' => true,
            'password' => Hash::make('correct-horse-battery-staple'),
        ], $attributes));
    }

    private function admin(array $attributes = []): User
    {
        return User::create(array_merge([
            'user_id' => 'USRADMIN',
            'name' => 'Company Admin',
            'email' => 'admin@example.com',
            'role' => Role::ADMIN,
            'status' => true,
            'password' => Hash::make('correct-horse-battery-staple'),
        ], $attributes));
    }

    public function test_a_super_admin_can_sign_in_and_receives_a_session(): void
    {
        $superAdmin = $this->superAdmin();

        $response = $this->postJson('/api/super-admin/login', [
            'login' => 'super.admin@example.com',
            'password' => 'correct-horse-battery-staple',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.role', Role::SUPER_ADMIN)
            ->assertJsonPath('user.email', 'super.admin@example.com')
            ->assertJsonMissingPath('user.password')
            ->assertJsonMissingPath('user.pwd');

        $this->assertAuthenticatedAs($superAdmin);
    }

    public function test_a_super_admin_can_sign_in_with_the_login_id(): void
    {
        $this->superAdmin();

        $response = $this->postJson('/api/super-admin/login', [
            'login' => 'USRSUPER',
            'password' => 'correct-horse-battery-staple',
        ]);

        $response->assertOk()->assertJsonPath('user.role', Role::SUPER_ADMIN);
        $this->assertAuthenticated();
    }

    public function test_invalid_credentials_are_rejected_with_a_generic_message(): void
    {
        $this->superAdmin();

        $response = $this->postJson('/api/super-admin/login', [
            'login' => 'super.admin@example.com',
            'password' => 'not-the-password',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('message', 'The provided credentials are not valid for a Super Admin account.');

        $this->assertGuest();
    }

    public function test_an_unknown_account_gets_the_same_generic_message(): void
    {
        $response = $this->postJson('/api/super-admin/login', [
            'login' => 'nobody@example.com',
            'password' => 'not-the-password',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('message', 'The provided credentials are not valid for a Super Admin account.');

        $this->assertGuest();
    }

    public function test_an_inactive_super_admin_cannot_sign_in(): void
    {
        $this->superAdmin(['status' => false]);

        $response = $this->postJson('/api/super-admin/login', [
            'login' => 'super.admin@example.com',
            'password' => 'correct-horse-battery-staple',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('message', 'The provided credentials are not valid for a Super Admin account.');

        $this->assertGuest();
    }

    public function test_a_company_admin_cannot_sign_in_as_super_admin(): void
    {
        $this->admin();

        $response = $this->postJson('/api/super-admin/login', [
            'login' => 'admin@example.com',
            'password' => 'correct-horse-battery-staple',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('message', 'The provided credentials are not valid for a Super Admin account.');

        $this->assertGuest();
    }

    public function test_the_login_endpoint_throttles_brute_force_attempts(): void
    {
        $this->superAdmin();

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/super-admin/login', [
                'login' => 'super.admin@example.com',
                'password' => 'wrong-password',
            ])->assertStatus(401);
        }

        $response = $this->postJson('/api/super-admin/login', [
            'login' => 'super.admin@example.com',
            'password' => 'correct-horse-battery-staple',
        ]);

        $response->assertStatus(429);
        $this->assertGuest();
    }

    public function test_the_login_endpoint_validates_its_input(): void
    {
        $this->postJson('/api/super-admin/login', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['login', 'password']);

        $this->postJson('/api/super-admin/login', [
            'login' => 'super.admin@example.com',
            'password' => '',
        ])->assertStatus(422)->assertJsonValidationErrors(['password']);
    }

    public function test_the_session_endpoint_returns_the_signed_in_super_admin(): void
    {
        $superAdmin = $this->superAdmin();

        $this->actingAs($superAdmin)
            ->getJson('/api/super-admin/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'super.admin@example.com')
            ->assertJsonPath('user.role', Role::SUPER_ADMIN)
            ->assertJsonMissingPath('user.password');
    }

    public function test_the_session_endpoint_rejects_anonymous_requests(): void
    {
        $this->getJson('/api/super-admin/me')->assertStatus(401);
    }

    public function test_the_session_endpoint_rejects_a_company_admin(): void
    {
        $this->actingAs($this->admin())
            ->getJson('/api/super-admin/me')
            ->assertStatus(403);
    }

    public function test_signing_out_destroys_the_session(): void
    {
        $superAdmin = $this->superAdmin();

        $this->actingAs($superAdmin)
            ->postJson('/api/super-admin/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Signed out.');

        $this->assertGuest('web');
        $this->assertNull(session()->get(Auth::guard('web')->getName()));
    }

    public function test_a_signed_out_super_admin_loses_access_to_the_api(): void
    {
        $this->superAdmin();

        $this->postJson('/api/super-admin/login', [
            'login' => 'super.admin@example.com',
            'password' => 'correct-horse-battery-staple',
        ])->assertOk();

        $this->postJson('/api/super-admin/logout')->assertOk();

        // The browser no longer holds the session cookie.
        $this->flushSession();
        $this->app['auth']->forgetGuards();

        $this->getJson('/api/super-admin/me')->assertStatus(401);
        $this->getJson('/api/super-admin/dashboard')->assertStatus(401);
    }

    public function test_a_company_admin_only_sees_the_users_of_their_own_company(): void
    {
        $company = Company::create(['name' => 'Acme', 'slug' => 'acme', 'status' => 'active']);
        $otherCompany = Company::create(['name' => 'Globex', 'slug' => 'globex', 'status' => 'active']);

        $admin = $this->admin(['company_id' => $company->id]);
        $this->admin(['email' => 'other@example.com', 'user_id' => 'USROTHER', 'company_id' => $otherCompany->id]);
        $this->superAdmin();

        $this->actingAs($admin);

        $emails = User::withoutGlobalScopes()->pluck('email');

        $this->assertTrue($emails->contains('admin@example.com'));
        $this->assertFalse(User::all()->pluck('email')->contains('other@example.com'));
    }
}
