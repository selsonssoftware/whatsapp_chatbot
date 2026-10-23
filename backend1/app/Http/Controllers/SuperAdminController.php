<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyFeaturePermission;
use App\Models\CompanySubscription;
use App\Models\Plan;
use App\Models\SubscriptionPayment;
use App\Support\PlatformFeature;
use App\Support\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Platform administration endpoints.
 *
 * Every route of this controller is protected by the `auth:sanctum`, `active`
 * and `role:super_admin` middleware, so the checks below always run for an
 * authenticated, active Super Admin.
 */
class SuperAdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $companies = Company::with('activeSubscription.plan')->orderBy('name')->get();

        $planDistribution = Plan::orderBy('sort_order')->get()->map(function (Plan $plan) {
            return [
                'plan' => $plan->name,
                'companies' => CompanySubscription::where('plan_id', $plan->id)->distinct()->count('company_id'),
            ];
        });

        return response()->json([
            'stats' => [
                'companies' => Company::count(),
                'active_companies' => Company::where('status', Company::STATUS_ACTIVE)->count(),
                'suspended_companies' => Company::where('status', Company::STATUS_SUSPENDED)->count(),
                'plans' => Plan::count(),
                'subscriptions' => CompanySubscription::count(),
                'active_subscriptions' => CompanySubscription::where('status', CompanySubscription::STATUS_ACTIVE)->count(),
                'payments' => SubscriptionPayment::count(),
                'collected_amount' => (string) SubscriptionPayment::where('status', SubscriptionPayment::STATUS_PAID)->sum('amount'),
            ],
            'plan_distribution' => $planDistribution,
            'companies' => $companies->take(5)->map(fn (Company $company) => $this->companySummary($company)),
            'recent_payments' => SubscriptionPayment::with(['company', 'subscription.plan'])
                ->orderByDesc('created_at')
                ->take(5)
                ->get()
                ->map(fn (SubscriptionPayment $payment) => $this->paymentSummary($payment)),
        ]);
    }

    public function companies(): JsonResponse
    {
        $companies = Company::with(['activeSubscription.plan', 'featurePermissions'])
            ->orderBy('name')
            ->get()
            ->map(fn (Company $company) => $this->companySummary($company));

        return response()->json(['data' => $companies]);
    }

    public function storeCompany(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:255'],
            'plan_id' => ['nullable', 'integer', 'exists:plans,id'],
        ]);

        $company = Company::create([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name']),
            'email' => $validated['email'] ?? null,
            'status' => Company::STATUS_ACTIVE,
        ]);

        if (! empty($validated['plan_id'])) {
            CompanySubscription::create([
                'company_id' => $company->id,
                'plan_id' => $validated['plan_id'],
                'status' => CompanySubscription::STATUS_ACTIVE,
                'starts_at' => now()->toDateString(),
            ]);
        }

        return response()->json([
            'message' => 'Company created.',
            'company' => $this->companySummary($company->fresh('activeSubscription.plan')),
        ], 201);
    }

    public function updateCompany(Request $request, Company $company): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'required', Rule::in([Company::STATUS_ACTIVE, Company::STATUS_SUSPENDED])],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
        ]);

        $company->fill(array_filter($validated, fn ($value) => $value !== null));
        $company->save();

        return response()->json([
            'message' => 'Company updated.',
            'company' => $this->companySummary($company->fresh('activeSubscription.plan')),
        ]);
    }

    public function plans(): JsonResponse
    {
        $plans = Plan::orderBy('sort_order')->orderBy('name')->get()->map(function (Plan $plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'price_monthly' => (string) $plan->price_monthly,
                'features' => $plan->featureKeys(),
                'is_active' => (bool) $plan->is_active,
                'companies' => CompanySubscription::where('plan_id', $plan->id)->distinct()->count('company_id'),
            ];
        });

        return response()->json(['data' => $plans]);
    }

    public function subscriptions(): JsonResponse
    {
        $subscriptions = CompanySubscription::with(['company', 'plan'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function (CompanySubscription $subscription) {
                return [
                    'id' => $subscription->id,
                    'company' => [
                        'id' => $subscription->company->id,
                        'name' => $subscription->company->name,
                    ],
                    'plan' => [
                        'id' => $subscription->plan->id,
                        'name' => $subscription->plan->name,
                        'price_monthly' => (string) $subscription->plan->price_monthly,
                    ],
                    'status' => $subscription->status,
                    'starts_at' => optional($subscription->starts_at)->toDateString(),
                    'ends_at' => optional($subscription->ends_at)->toDateString(),
                    'created_at' => optional($subscription->created_at)->toISOString(),
                ];
            });

        return response()->json(['data' => $subscriptions]);
    }

    public function storeSubscription(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
            'status' => ['required', Rule::in([
                CompanySubscription::STATUS_TRIALING,
                CompanySubscription::STATUS_ACTIVE,
                CompanySubscription::STATUS_CANCELED,
                CompanySubscription::STATUS_EXPIRED,
            ])],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        // A company holds one live subscription per plan, the newest one wins.
        $subscription = CompanySubscription::updateOrCreate(
            [
                'company_id' => $validated['company_id'],
                'plan_id' => $validated['plan_id'],
            ],
            [
                'status' => $validated['status'],
                'starts_at' => $validated['starts_at'] ?? now()->toDateString(),
                'ends_at' => $validated['ends_at'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Subscription saved.',
            'subscription' => [
                'id' => $subscription->id,
                'company_id' => $subscription->company_id,
                'plan_id' => $subscription->plan_id,
                'status' => $subscription->status,
                'starts_at' => optional($subscription->starts_at)->toDateString(),
                'ends_at' => optional($subscription->ends_at)->toDateString(),
            ],
        ], 201);
    }

    public function featureControls(): JsonResponse
    {
        $companies = Company::with(['activeSubscription.plan', 'featurePermissions'])
            ->orderBy('name')
            ->get()
            ->map(function (Company $company) {
                $overrides = [];

                foreach ($company->featurePermissions as $permission) {
                    $overrides[$permission->feature] = (bool) $permission->enabled;
                }

                return [
                    'company' => [
                        'id' => $company->id,
                        'name' => $company->name,
                        'status' => $company->status,
                    ],
                    'plan' => $company->activeSubscription && $company->activeSubscription->plan
                        ? [
                            'id' => $company->activeSubscription->plan->id,
                            'name' => $company->activeSubscription->plan->name,
                            'features' => $company->activeSubscription->plan->featureKeys(),
                        ]
                        : null,
                    'overrides' => $overrides,
                ];
            });

        return response()->json([
            'features' => PlatformFeature::ALL,
            'data' => $companies,
        ]);
    }

    public function updateFeatureControl(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'feature' => ['required', 'string', Rule::in(PlatformFeature::keys())],
            'enabled' => ['required', 'boolean'],
        ]);

        $permission = CompanyFeaturePermission::updateOrCreate(
            [
                'company_id' => $validated['company_id'],
                'feature' => $validated['feature'],
            ],
            ['enabled' => (bool) $validated['enabled']]
        );

        return response()->json([
            'message' => 'Feature permission updated.',
            'permission' => [
                'company_id' => $permission->company_id,
                'feature' => $permission->feature,
                'enabled' => (bool) $permission->enabled,
            ],
        ]);
    }

    public function payments(): JsonResponse
    {
        $payments = SubscriptionPayment::with(['company', 'subscription.plan'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (SubscriptionPayment $payment) => $this->paymentSummary($payment));

        return response()->json(['data' => $payments]);
    }

    public function storePayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'subscription_id' => ['required', 'integer', 'exists:company_subscriptions,id'],
            'amount' => ['required', 'numeric', 'min:0', 'max:10000000'],
            'currency' => ['nullable', 'string', 'size:3'],
            'method' => ['nullable', Rule::in(['manual', 'card', 'bank_transfer'])],
            'status' => ['required', Rule::in([
                SubscriptionPayment::STATUS_PENDING,
                SubscriptionPayment::STATUS_PAID,
                SubscriptionPayment::STATUS_FAILED,
                SubscriptionPayment::STATUS_REFUNDED,
            ])],
            'reference' => ['nullable', 'string', 'max:120'],
            'paid_at' => ['nullable', 'date'],
        ]);

        $payment = SubscriptionPayment::create([
            'company_id' => $validated['company_id'],
            'subscription_id' => $validated['subscription_id'],
            'amount' => $validated['amount'],
            'currency' => strtoupper($validated['currency'] ?? 'USD'),
            'method' => $validated['method'] ?? 'manual',
            'status' => $validated['status'],
            'reference' => $validated['reference'] ?? null,
            'paid_at' => $validated['status'] === SubscriptionPayment::STATUS_PAID
                ? ($validated['paid_at'] ?? now())
                : $validated['paid_at'] ?? null,
        ]);

        return response()->json([
            'message' => 'Payment recorded.',
            'payment' => $this->paymentSummary($payment->load(['company', 'subscription.plan'])),
        ], 201);
    }

    public function reports(): JsonResponse
    {
        $revenueByPlan = Plan::orderBy('sort_order')->get()->map(function (Plan $plan) {
            $subscriptionIds = CompanySubscription::where('plan_id', $plan->id)->pluck('id');

            return [
                'plan' => $plan->name,
                'subscriptions' => $subscriptionIds->count(),
                'collected_amount' => (string) SubscriptionPayment::whereIn('subscription_id', $subscriptionIds)
                    ->where('status', SubscriptionPayment::STATUS_PAID)
                    ->sum('amount'),
            ];
        });

        $paymentsByStatus = SubscriptionPayment::selectRaw('status, count(*) as total, sum(amount) as amount')
            ->groupBy('status')
            ->get()
            ->map(fn ($row) => [
                'status' => $row->status,
                'count' => (int) $row->total,
                'amount' => (string) $row->amount,
            ]);

        $monthlyRevenue = collect(range(5, 0))->map(function (int $monthsAgo) {
            $month = now()->subMonths($monthsAgo)->startOfMonth();

            return [
                'month' => $month->format('Y-m'),
                'amount' => (string) SubscriptionPayment::where('status', SubscriptionPayment::STATUS_PAID)
                    ->where('paid_at', '>=', $month)
                    ->where('paid_at', '<', $month->copy()->addMonth())
                    ->sum('amount'),
            ];
        });

        return response()->json([
            'companies_by_status' => Company::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->get()
                ->map(fn ($row) => ['status' => $row->status, 'count' => (int) $row->total]),
            'subscriptions_by_status' => CompanySubscription::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->get()
                ->map(fn ($row) => ['status' => $row->status, 'count' => (int) $row->total]),
            'payments_by_status' => $paymentsByStatus,
            'revenue_by_plan' => $revenueByPlan,
            'monthly_revenue' => $monthlyRevenue,
            'admin_accounts' => \App\Models\User::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
                ->where('role', Role::ADMIN)
                ->count(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function companySummary(Company $company): array
    {
        $plan = $company->activeSubscription?->plan;

        return [
            'id' => $company->id,
            'name' => $company->name,
            'slug' => $company->slug,
            'email' => $company->email,
            'status' => $company->status,
            'plan' => $plan ? $plan->name : null,
            'plan_id' => $plan ? $plan->id : null,
            'subscription_status' => $company->activeSubscription?->status,
            'admins' => $company->users()->where('role', Role::ADMIN)->count(),
            'feature_overrides' => $company->featurePermissions->count(),
            'created_at' => optional($company->created_at)->toISOString(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function paymentSummary(SubscriptionPayment $payment): array
    {
        return [
            'id' => $payment->id,
            'company' => [
                'id' => $payment->company->id,
                'name' => $payment->company->name,
            ],
            'plan' => $payment->subscription && $payment->subscription->plan
                ? $payment->subscription->plan->name
                : null,
            'amount' => (string) $payment->amount,
            'currency' => $payment->currency,
            'method' => $payment->method,
            'status' => $payment->status,
            'reference' => $payment->reference,
            'paid_at' => optional($payment->paid_at)->toISOString(),
            'created_at' => optional($payment->created_at)->toISOString(),
        ];
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'company';
        $slug = $base;
        $suffix = 1;

        while (Company::where('slug', $slug)->exists()) {
            $suffix++;
            $slug = $base . '-' . $suffix;
        }

        return $slug;
    }
}
