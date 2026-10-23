<?php

namespace App\Support;

/**
 * Feature keys a company can be granted by a plan or by an explicit
 * company level override.
 */
final class PlatformFeature
{
    /**
     * @var array<string, string>
     */
    public const ALL = [
        'whatsapp_business_api' => 'WhatsApp Business API',
        'team_inbox' => 'Team Inbox',
        'campaigns' => 'Campaigns',
        'automation' => 'Automation',
        'chatbot_builder' => 'Chatbot Builder',
        'ai_agent' => 'AI Agent',
        'whatsapp_flows' => 'WhatsApp Flows',
        'catalog_orders' => 'Catalog & Orders',
        'payments' => 'Payments',
        'reports' => 'Reports & Analytics',
        'api_logs' => 'API Logs',
        'integrations' => 'Integrations',
    ];

    /**
     * @return array<int, string>
     */
    public static function keys(): array
    {
        return array_keys(self::ALL);
    }

    public static function label(string $key): string
    {
        return self::ALL[$key] ?? $key;
    }

    public static function exists(string $key): bool
    {
        return array_key_exists($key, self::ALL);
    }
}
