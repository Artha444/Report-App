<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('status');
            $table->text('user_feedback')->nullable()->after('rejection_reason');
            $table->string('resolution_evidence')->nullable()->after('resolved_at');
            $table->text('resolution_notes')->nullable()->after('resolution_evidence');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn([
                'rejection_reason',
                'user_feedback',
                'resolution_evidence',
                'resolution_notes',
            ]);
        });
    }
};
