<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function addIndexIfMissing(string $table, $columns, string $indexName = null): void
    {
        $existing = collect(DB::select("PRAGMA index_list({$table})"))->pluck('name')->all();
        $checkName = $indexName ?? (is_array($columns) ? "{$table}_" . implode('_', $columns) . "_index" : "{$table}_{$columns}_index");

        if (!in_array($checkName, $existing)) {
            Schema::table($table, fn (Blueprint $t) => is_array($columns) ? $t->index($columns) : $t->index($columns));
        }
    }

    public function up(): void
    {
        $this->addIndexIfMissing('orders', 'status');
        $this->addIndexIfMissing('orders', 'created_at');
        $this->addIndexIfMissing('orders', ['status', 'created_at']);
        $this->addIndexIfMissing('orders', 'customer_phone');
        $this->addIndexIfMissing('orders', 'customer_id');

        $this->addIndexIfMissing('order_items', 'plat_id');
        $this->addIndexIfMissing('order_items', 'order_id');

        $this->addIndexIfMissing('plats', 'categorie');
        $this->addIndexIfMissing('plats', 'menu_id');
        $this->addIndexIfMissing('plats', 'is_promotion');

        $this->addIndexIfMissing('customers', 'phone');
        $this->addIndexIfMissing('customers', 'email');
        $this->addIndexIfMissing('customers', 'created_at');

        $this->addIndexIfMissing('sessions', 'user_id');
        $this->addIndexIfMissing('sessions', 'last_activity');
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['status', 'created_at']);
            $table->dropIndex(['customer_phone']);
            $table->dropIndex(['customer_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['plat_id']);
            $table->dropIndex(['order_id']);
        });

        Schema::table('plats', function (Blueprint $table) {
            $table->dropIndex(['categorie']);
            $table->dropIndex(['menu_id']);
            $table->dropIndex(['is_promotion']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['phone']);
            $table->dropIndex(['email']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['last_activity']);
        });
    }
};
