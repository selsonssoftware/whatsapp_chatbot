<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
use App\Support\PlatformFeature;
use App\Support\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds the platform configuration a Super Admin needs to run the platform:
 * the three subscription plans and, when the environment provides them, the
 * initial Super Admin account.
 *
 * Credentials are never hardcoded: the Super Admin account is only created
 * when SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are set in the environment.
 */
class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPlans();
        $this->seedSuperAdmin();
    }

    private function seedPlans(): void
    {
        $plans = [
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'WhatsApp messaging essentials for small teams.',
                'price_monthly' => 99,
                'sort_order' => 1,
                'features' => [
                    'whatsapp_business_api',
                    'team_inbox',
                    'campaigns',
                    'reports',
                ],
            ],
            [
                'name' => 'Advance',
                'slug' => 'advance',
                'description' => 'Automation and commerce for growing companies.',
                'price_monthly' => 299,
                'sort_order' => 2,
                'features' => [
                    'whatsapp_business_api',
                    'team_inbox',
                    'campaigns',
                    'automation',
                    'chatbot_builder',
                    'catalog_orders',
                    'reports',
                    'api_logs',
                ],
            ],
            [
                'name' => 'Prime',
                'slug' => 'prime',
                'description' => 'Full platform access including AI and flows.',
                'price_monthly' => 599,
                'sort_order' => 3,
                'features' => PlatformFeature::keys(),
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']],
                [
                    'name' => $plan['name'],
                    'description' => $plan['description'],
                    'price_monthly' => $plan['price_monthly'],
                    'features' => array_values(array_filter($plan['features'])),
                    'is_active' => true,
                    'sort_order' => $plan['sort_order'],
                ]
            );
        }
    }

    private function seedSuperAdmin(): void
    {
        $email = env('SUPER_ADMIN_EMAIL');
        $password = env('SUPER_ADMIN_PASSWORD');

        if (! $email || ! $password) {
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'user_id' => 'USRSUPER',
                'name' => env('SUPER_ADMIN_NAME', 'Super Admin'),
                'role' => Role::SUPER_ADMIN,
                'status' => true,
                'password' => Hash::make($password),
            ]
        );
    }
}
