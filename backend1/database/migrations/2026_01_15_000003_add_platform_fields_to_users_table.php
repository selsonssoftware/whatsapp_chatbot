<?php

use App\Support\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the platform role and tenant columns the CRM needs on top of the
 * default Laravel users table.
 *
 * The migration is defensive: production databases already carry some of
 * these columns (they were added by hand before the migration existed), so
 * every column is only created when it is missing.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'user_id')) {
                $table->string('user_id')->nullable()->unique();
            }

            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable();
            }

            if (! Schema::hasColumn('users', 'role')) {
                $table->string('role')->default(Role::ADMIN)->index();
            }

            if (! Schema::hasColumn('users', 'status')) {
                $table->boolean('status')->default(true)->index();
            }

            if (! Schema::hasColumn('users', 'company_id')) {
                $table->unsignedBigInteger('company_id')->nullable()->index();
            }

            if (! Schema::hasColumn('users', 'languages')) {
                $table->json('languages')->nullable();
            }

            if (! Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }
        });

        try {
            Schema::table('users', function (Blueprint $table) {
                $table->foreign('company_id')->references('id')->on('companies')->nullOnDelete();
            });
        } catch (\Throwable) {
            // The constraint already exists on this database.
        }
    }

    public function down(): void
    {
        try {
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['company_id']);
            });
        } catch (\Throwable) {
            // The constraint was never created.
        }

        Schema::table('users', function (Blueprint $table) {
            $columns = array_values(array_filter([
                Schema::hasColumn('users', 'user_id') ? 'user_id' : null,
                Schema::hasColumn('users', 'phone') ? 'phone' : null,
                Schema::hasColumn('users', 'role') ? 'role' : null,
                Schema::hasColumn('users', 'status') ? 'status' : null,
                Schema::hasColumn('users', 'company_id') ? 'company_id' : null,
                Schema::hasColumn('users', 'languages') ? 'languages' : null,
                Schema::hasColumn('users', 'last_login_at') ? 'last_login_at' : null,
            ]));

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
