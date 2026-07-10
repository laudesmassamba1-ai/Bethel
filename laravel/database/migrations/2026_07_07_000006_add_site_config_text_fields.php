<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_configs', function (Blueprint $table) {
            $table->string('hero_cta_label')->default('Voir le menu');
            $table->string('cart_open_label')->default('Voir mon panier');
            $table->string('menu_section_label')->default('NOS SECTIONS');
            $table->string('menu_section_title')->default('Explorez nos créations');
            $table->text('menu_section_description')->nullable();
            $table->string('menu_cta_label')->default('Commander sur WhatsApp');
            $table->string('cart_clear_text')->default('Vider le panier');
            $table->string('cart_header')->default('Total');
            $table->string('cart_checkout_label')->default('Commander via WhatsApp');
        });
    }

    public function down(): void
    {
        Schema::table('site_configs', function (Blueprint $table) {
            $table->dropColumn(['hero_cta_label', 'cart_open_label', 'menu_section_label', 'menu_section_title', 'menu_section_description', 'menu_cta_label', 'cart_clear_text', 'cart_header', 'cart_checkout_label']);
        });
    }
};
