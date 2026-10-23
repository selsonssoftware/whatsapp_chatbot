<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\CompanyFeaturePermission;
use App\Models\Plan;
use App\Models\User;
use App\Support\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SuperAdminApiTest extends TestCase
{
    use RefreshDatabase;

    private function superAdmin(): User
    {
        return User::create([
            'user_id' => 'USRSUPER',
            'name' => 'Platform Super Admin',
            'email' => 'super.admin@example.com',
            'role' => Role::SUPER_ADMIN,
            'status' => true,
            'password' => Hash::make('correct-horse-battery-staple'),
        ]);
    }

    private function admin(): User
    {
        return User::create([
            'user_id' => 'USRADMIN',
            'name' => 'Company Admin',
            'email' => 'admin@example.com',
            'role' => Role::ADMIN,
            'status' => true,
            'password' => Hash::make('correct-horse-battery-staple'),
        ]);
    }

    private function plan(): Plan
    {
        return Plan::create([
            'name' => 'Basic',
            'slug' => 'basic',
            'description' => 'Essentials',
            'price_monthly' => 99,
            'features' => ['whatsapp_business_api', 'team_inbox'],
            'is_active' => true,
            'sort_order' => 1,
        ]);
    }

    public function test_the_super_admin_api_is_closed_for_anonymous_requests(): void
    {
        $this->getJson('/api/super-admin/dashboard')->assertStatus(401);
        $this->getJson('/api/super-admin/companies')->assertStatus(401);
        $this->getJson('/api/super-admin/plans')->assertStatus(401);
        $this->getJson('/api/super-admin/subscriptions')->assertStatus(401);
        $this->getJson('/api/super-admin/feature-controls')->assertStatus(401);
        $this->getJson('/api/super-admin/payments')->assertStatus(401);
        $this->getJson('/api/super-admin/reports')->assertStatus(401);
    }

    public function test_a_company_admin_is_denied_access_to_the_super_admin_api(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->getJson('/api/super-admin/dashboard')->assertStatus(403);
        $this->actingAs($admin)->getJson('/api/super-admin/companies')->assertStatus(403);
        $this->actingAs($admin)->postJson('/api/super-admin/companies', ['name' => 'Hijacked'])->assertStatus(403);
    }

    public function test_an_inactive_super_admin_loses_access(): void
    {
        $superAdmin = $this->superAdmin();
        $superAdmin->forceFill(['status' => false])->save();

        $this->actingAs($superAdmin)->getJson('/api/super-admin/dashboard')->assertStatus(403);
    }

    public function test_the_dashboard_reports_the_stored_platform_figures(): void
    {
        $plan = $this->plan();
        $company = Company::create(['name' => 'Acme', 'slug' => 'acme', 'status' => 'active']);
        $company->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now()->toDateString(),
        ]);

        $response = $this->actingAs($this->superAdmin())->getJson('/api/super-admin/dashboard');

        $response->assertOk()
            ->assertJsonPath('stats.companies', 1)
            ->assertJsonPath('stats.plans', 1)
            ->assertJsonPath('stats.active_subscriptions', 1)
            ->assertJsonPath('companies.0.name', 'Acme');
    }

    public function test_a_company_can_be_created_and_suspended(): void
    {
        $plan = $this->plan();
        $superAdmin = $this->superAdmin();

        $this->actingAs($superAdmin)
            ->postJson('/api/super-admin/companies', [
                'name' => 'Acme Corp',
                'email' => 'billing@acme.test',
                'plan_id' => $plan->id,
            ])
            ->assertStatus(201)
            ->assertJsonPath('company.plan', 'Basic')
            ->assertJsonPath('company.status', 'active');

        $company = Company::where('slug', 'acme-corp')->firstOrFail();

        $this->actingAs($superAdmin)
            ->patchJson('/api/super-admin/companies/' . $company->id, ['status' => 'suspended'])
            ->assertOk()
            ->assertJsonPath('company.status', 'suspended');
    }

    public function test_a_company_feature_permission_is_stored(): void
    {
        $company = Company::create(['name' => 'Acme', 'slug' => 'acme', 'status' => 'active']);
        $superAdmin = $this->superAdmin();

        $this->actingAs($superAdmin)
            ->putJson('/api/super-admin/feature-controls', [
                'company_id' => $company->id,
                'feature' => 'ai_agent',
                'enabled' => true,
            ])
            ->assertOk()
            ->assertJsonPath('permission.enabled', true);

        $this->assertDatabaseHas('company_feature_permissions', [
            'company_id' => $company->id,
            'feature' => 'ai_agent',
            'enabled' => true,
        ]);

        $this->actingAs($superAdmin)
            ->putJson('/api/super-admin/feature-controls', [
                'company_id' => $company->id,
                'feature' => 'not-a-feature',
                'enabled' => true,
            ])
            ->assertStatus(422);

        $this->assertSame(1, CompanyFeaturePermission::count());
    }

    public function test_a_payment_is_stored_for_a_subscription(): void
    {
        $plan = $this->plan();
        $company = Company::create(['name' => 'Acme', 'slug' => 'acme', 'status' => 'active']);
        $subscription = $company->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now()->toDateString(),
        ]);
        $superAdmin = $this->superAdmin();

        $this->actingAs($superAdmin)
            ->postJson('/api/super-admin/payments', [
                'company_id' => $company->id,
                'subscription_id' => $subscription->id,
                'amount' => 99.5,
                'currency' => 'usd',
                'method' => 'manual',
                'status' => 'paid',
            ])
            ->assertStatus(201)
            ->assertJsonPath('payment.amount', '99.50')
            ->assertJsonPath('payment.currency', 'USD');

        $this->actingAs($superAdmin)
            ->getJson('/api/super-admin/reports')
            ->assertOk()
            ->assertJsonPath('revenue_by_plan.0.collected_amount', '99.50');
    }

    public function test_the_public_registration_never_creates_a_super_admin(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Someone',
            'email' => 'someone@example.com',
            'phone' => '+919876543210',
            'password' => 'supersecret',
            'role' => 'super_admin',
            'status' => true,
            'languages' => ['en'],
        ])->assertStatus(201);

        $user = User::where('email', 'someone@example.com')->firstOrFail();

        $this->assertSame(Role::ADMIN, $user->role);
        $this->assertNull($user->pwd);
        $this->assertTrue(Hash::check('supersecret', $user->password));
    }
}
