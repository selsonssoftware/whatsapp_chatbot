<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_feature_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('feature');
            $table->boolean('enabled')->default(false);
            $table->timestamps();

            $table->unique(['company_id', 'feature']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_feature_permissions');
    }
};
