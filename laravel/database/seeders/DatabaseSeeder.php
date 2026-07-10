<?php

namespace Database\Seeders;

use App\Models\Plat;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'admin@bethel.test',
        ], [
            'name' => 'Admin Bethel',
            'password' => Hash::make('password123'),
        ]);

        $samples = [
            [
                'titre' => 'Classic Smash Burger',
                'categorie' => 'Burgers',
                'prix' => 7500,
                'image' => 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
                'is_bestseller' => true,
            ],
            [
                'titre' => 'BBQ Bacon Stack',
                'categorie' => 'Burgers',
                'prix' => 9500,
                'image' => 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=900&q=80',
                'is_bestseller' => false,
            ],
            [
                'titre' => 'Margherita Royale',
                'categorie' => 'Pizzas',
                'prix' => 7000,
                'image' => 'https://images.unsplash.com/photo-1548365328-5ac0eeb176c8?auto=format&fit=crop&w=900&q=80',
                'is_bestseller' => false,
            ],
            [
                'titre' => 'Street Chicken Taco',
                'categorie' => 'Tacos',
                'prix' => 8200,
                'image' => 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
                'is_bestseller' => true,
            ],
            [
                'titre' => 'Limonade Dorée',
                'categorie' => 'Boissons',
                'prix' => 2500,
                'image' => 'https://images.unsplash.com/photo-1532635246-87d846180ec7?auto=format&fit=crop&w=900&q=80',
                'is_bestseller' => false,
            ],
            [
                'titre' => 'Molten Choco Bomb',
                'categorie' => 'Desserts',
                'prix' => 4500,
                'image' => 'https://images.unsplash.com/photo-1505253217848-2d6f1a8b1f6f?auto=format&fit=crop&w=900&q=80',
                'is_bestseller' => false,
            ],
        ];

        foreach ($samples as $data) {
            Plat::updateOrCreate([
                'titre' => $data['titre'],
            ], $data);
        }

        $menus = [
            [
                'nom' => 'Menu du chef',
                'description' => 'Une sélection maison avec nos plats signatures.',
                'is_active' => true,
            ],
            [
                'nom' => 'Menu rafraîchissant',
                'description' => 'Boissons et desserts pour clore le repas en beauté.',
                'is_active' => true,
            ],
        ];

        foreach ($menus as $menuData) {
            \App\Models\Menu::updateOrCreate([
                'nom' => $menuData['nom'],
            ], $menuData);
        }

        $menuMap = [
            'Burgers' => \App\Models\Menu::where('nom', 'Menu du chef')->first()->id,
            'Pizzas' => \App\Models\Menu::where('nom', 'Menu du chef')->first()->id,
            'Boissons' => \App\Models\Menu::where('nom', 'Menu rafraîchissant')->first()->id,
            'Desserts' => \App\Models\Menu::where('nom', 'Menu rafraîchissant')->first()->id,
        ];

        foreach (Plat::all() as $plat) {
            $plat->menu_id = $menuMap[$plat->categorie] ?? null;
            $plat->save();
        }

        \App\Models\SiteConfig::updateOrCreate([
            'id' => 1,
        ], [
            'brand_name' => 'BETHEL',
            'brand_accent' => 'KITCHEN',
            'hero_subtitle' => 'Cuisine authentique & ambiance cel-shading',
            'hero_title' => 'Saveurs puissantes, design audacieux.',
            'hero_copy' => 'Découvrez notre menu premium, commandez en direct et recevez une expérience culinaire visre, sirop d\'agave, eau pétillante', 'prix' => 2500, 'categorie' => 'Boissons', 'image' => 'https://images.unsplash.com/photo-1541779972238-2c60cd11ffc5?w=500&h=400&fit=crop&auto=format', 'rating' => 4.7, 'temps' => 5],
        ];

        foreach ($plats as $data) {
            Plat::updateOrCreate(['titre' => $data['titre']], $data);
        }

        $menus = [
            ['nom' => 'Menu du chef', 'description' => 'Une sélection maison avec nos plats signatures.', 'is_active' => true],
            ['nom' => 'Menu rafraîchissant', 'description' => 'Boissons et desserts pour clore le repas en beauté.', 'is_active' => true],
        ];

        foreach ($menus as $menuData) {
            Menu::updateOrCreate(['nom' => $menuData['nom']], $menuData);
        }

        $menuDuChefId = Menu::where('nom', 'Menu du chef')->first()->id;
        $menuRafraichissantId = Menu::where('nom', 'Menu rafraîchissant')->first()->id;

        $menuMap = [
            'Burgers' => $menuDuChefId,
            'Pizzas' => $menuDuChefId,
            'Tacos' => $menuDuChefId,
            'Desserts' => $menuRafraichissantId,
            'Boissons' => $menuRafraichissantId,
        ];

        foreach (Plat::all() as $plat) {
            if (isset($menuMap[$plat->categorie])) {
                $plat->menu_id = $menuMap[$plat->categorie];
                $plat->save();
            }
        }

        SiteConfig::updateOrCreate(['id' => 1], [
            'brand_name' => 'BETHEL',
            'brand_accent' => 'KITCHEN',
            'hero_subtitle' => 'Cuisine d\'exception',
            'hero_title' => 'SAVEURS AUTHENTIQUES',
            'hero_copy' => 'Chaque plat est préparé avec soin, de bons ingrédients et une générosité sans compromis. Une expérience culinaire qui parle à l\'âme.',
            'whatsapp_number' => '33600000000',
        ]);
    }
}
