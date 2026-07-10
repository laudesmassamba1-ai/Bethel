<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration pour créer la table `plats`.
 *
 * Structure demandée :
 * - id (PK)
 * - titre (string)
 * - prix (integer, en FCFA)
 * - categorie (string, valeurs : Burgers, Pizzas, Boissons, Desserts)
 * - image (string, chemin relatif dans storage, nullable)
 * - is_bestseller (boolean, default false)
 * - timestamps (created_at, updated_at)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('plats', function (Blueprint $table) {
            $table->id(); // clé primaire auto-incrémentée
            $table->string('titre'); // titre du plat (ex: "Classic Smash Burger")
            $table->integer('prix'); // prix en FCFA (entier)
            $table->string('categorie'); // Burgers, Pizzas, Boissons, Desserts
            $table->string('image')->nullable(); // chemin relatif vers storage (public), nullable
            $table->boolean('is_bestseller')->default(false); // badge best seller
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('plats');
    }
};
