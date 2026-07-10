<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_configs', function (Blueprint $table) {
            $table->id();
            $table->string('brand_name')->default('BETHEL');
            $table->string('brand_accent')->default('KITCHEN');
            $table->string('hero_subtitle')->default('Cuisine authentique & ambiance cel-shading');
            $table->string('hero_title')->default('Saveurs puissantes, design audacieux.');
            $table->text('hero_copy')->nullable();
            $table->string('whatsapp_number')->default('22900000000');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_configs');
    }
};
