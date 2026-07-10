<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plats', function (Blueprint $table) {
            $table->text('description')->nullable()->after('titre');
            $table->string('temps')->nullable()->after('prix');
            $table->float('rating')->nullable()->after('temps');
            $table->boolean('is_spicy')->default(false)->after('rating');
        });
    }

    public function down(): void
    {
        Schema::table('plats', function (Blueprint $table) {
            $table->dropColumn(['description', 'temps', 'rating', 'is_spicy']);
        });
    }
};
