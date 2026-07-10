<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plats', function (Blueprint $table) {
            $table->foreignId('menu_id')->nullable()->constrained('menus')->nullOnDelete()->after('image');
            $table->boolean('is_promotion')->default(false)->after('is_bestseller');
            $table->integer('promotion_prix')->nullable()->after('is_promotion');
        });
    }

    public function down(): void
    {
        Schema::table('plats', function (Blueprint $table) {
            $table->dropForeign(['menu_id']);
            $table->dropColumn(['menu_id', 'is_promotion', 'promotion_prix']);
        });
    }
};
