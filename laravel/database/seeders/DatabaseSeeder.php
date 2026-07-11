<?php

namespace Database\Seeders;

use App\Models\Plat;
use App\Models\Menu;
use App\Models\User;
use App\Models\SiteConfig;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@bethel.test'], [
            'name' => 'Admin Bethel',
            'password' => Hash::make('password123'),
            'is_admin' => true,
        ]);

        User::updateOrCreate(['email' => 'extends08@gmail.com'], [
            'name' => 'laudes',
            'password' => Hash::make('password123'),
            'is_admin' => true,
        ]);

        $plats = [
            ['titre' => 'Grillade de Bœuf BBQ', 'description' => 'Pièce de bœuf maturée, grillée au feu de bois, sauce barbecue maison, pommes de terre grenailles', 'prix' => 12000, 'categorie' => 'Bœuf', 'image' => 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop', 'is_bestseller' => true, 'is_promotion' => false, 'temps' => 25, 'rating' => 4.9, 'is_spicy' => false],
            ['titre' => 'Entrecôte Grillée', 'description' => 'Entrecôte de bœuf grillée, beurre maître d\'hôtel, légumes de saison', 'prix' => 15000, 'categorie' => 'Bœuf', 'image' => 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop', 'is_bestseller' => true, 'is_promotion' => false, 'temps' => 30, 'rating' => 4.8, 'is_spicy' => false],
            ['titre' => 'Brochette de Bœuf Mariné', 'description' => 'Brochettes de bœuf mariné aux épices douces, riz pilaf', 'prix' => 8500, 'categorie' => 'Bœuf', 'image' => 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => true, 'promotion_prix' => 7500, 'temps' => 20, 'rating' => 4.6, 'is_spicy' => true],

            ['titre' => 'Poulet Braisé Sauce Arachide', 'description' => 'Poulet fermier braisé lentement, sauce arachide onctueuse, alloco', 'prix' => 9500, 'categorie' => 'Poulet Braisé', 'image' => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop', 'is_bestseller' => true, 'is_promotion' => false, 'temps' => 30, 'rating' => 4.9, 'is_spicy' => false],
            ['titre' => 'Poulet Braisé Pimenté', 'description' => 'Poulet braisé au piment rouge, plantains frits, sauce tomate épicée', 'prix' => 8500, 'categorie' => 'Poulet Braisé', 'image' => 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => true, 'promotion_prix' => 7500, 'temps' => 25, 'rating' => 4.7, 'is_spicy' => true],
            ['titre' => 'Poulet Braisé au Four', 'description' => 'Poulet rôti au four, herbes de Provence, légumes rôtis, jus de viande', 'prix' => 10500, 'categorie' => 'Poulet Braisé', 'image' => 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => false, 'temps' => 35, 'rating' => 4.8, 'is_spicy' => false],

            ['titre' => 'Classic Smash Burger', 'description' => 'Steak haché bœuf, cheddar fondu, salade, tomate, oignon rouge, sauce secrète', 'prix' => 7500, 'categorie' => 'Burgers', 'image' => 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop', 'is_bestseller' => true, 'is_promotion' => false, 'temps' => 15, 'rating' => 4.7, 'is_spicy' => false],
            ['titre' => 'BBQ Bacon Stack', 'description' => 'Double steak, bacon croustillant, cheddar, oignons caramélisés, sauce BBQ maison', 'prix' => 9500, 'categorie' => 'Burgers', 'image' => 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => true, 'promotion_prix' => 8500, 'temps' => 18, 'rating' => 4.8, 'is_spicy' => false],
            ['titre' => 'Spicy Grilled Burger', 'description' => 'Steak grillé au BBQ, poivrons grillés, sauce chipotle, oignon frit', 'prix' => 8500, 'categorie' => 'Burgers', 'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => false, 'temps' => 18, 'rating' => 4.6, 'is_spicy' => true],

            ['titre' => 'Margherita Royale', 'description' => 'Sauce tomate maison, mozzarella di bufala, basilic frais, huile d\'olive', 'prix' => 7000, 'categorie' => 'Pizzas', 'image' => 'https://images.unsplash.com/photo-1548365328-5ac0eeb176c8?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => false, 'temps' => 20, 'rating' => 4.5, 'is_spicy' => false],
            ['titre' => 'Pizza BBQ Grill', 'description' => 'Poulet grillé, sauce BBQ, oignons rouges, poivrons, fromage fumé', 'prix' => 9500, 'categorie' => 'Pizzas', 'image' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop', 'is_bestseller' => true, 'is_promotion' => false, 'temps' => 22, 'rating' => 4.7, 'is_spicy' => false],

            ['titre' => 'Street Chicken Taco', 'description' => 'Poulet grillé épicé, salsa verde, oignon mariné, crème fraîche', 'prix' => 8200, 'categorie' => 'Tacos', 'image' => 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop', 'is_bestseller' => true, 'is_promotion' => false, 'temps' => 15, 'rating' => 4.6, 'is_spicy' => true],
            ['titre' => 'Tacos Carnitas Grill', 'description' => 'Bœuf grillé effiloché, guacamole, pico de gallo, fromage râpé', 'prix' => 9000, 'categorie' => 'Tacos', 'image' => 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => true, 'promotion_prix' => 7800, 'temps' => 16, 'rating' => 4.5, 'is_spicy' => true],

            ['titre' => 'Limonade Dorée', 'description' => 'Citron frais, sirop d\'agave, eau pétillante, menthe fraîche', 'prix' => 2500, 'categorie' => 'Boissons', 'image' => 'https://images.unsplash.com/photo-1532635246-87d846180ec7?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => false, 'temps' => 5, 'rating' => 4.4, 'is_spicy' => false],
            ['titre' => 'Jus de Bissap', 'description' => 'Infusion d\'hibiscus, gingembre frais, sucre de canne', 'prix' => 2000, 'categorie' => 'Boissons', 'image' => 'https://images.unsplash.com/photo-1541779972238-2c60cd11ffc5?w=600&h=400&fit=crop', 'is_bestseller' => true, 'is_promotion' => false, 'temps' => 5, 'rating' => 4.8, 'is_spicy' => false],

            ['titre' => 'Molten Choco Bomb', 'description' => 'Moelleux au chocolat noir, cœur coulant, glace vanille', 'prix' => 4500, 'categorie' => 'Desserts', 'image' => 'https://images.unsplash.com/photo-1505253217848-2d6f1a8b1f6f?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => false, 'temps' => 12, 'rating' => 4.9, 'is_spicy' => false],
            ['titre' => 'Ananas Grillée Caramel', 'description' => 'Ananas frais grillé au miel, caramel beurre salé, glace coco', 'prix' => 5500, 'categorie' => 'Desserts', 'image' => 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop', 'is_bestseller' => false, 'is_promotion' => false, 'temps' => 10, 'rating' => 4.7, 'is_spicy' => false],
        ];

        foreach ($plats as $data) {
            Plat::updateOrCreate(['titre' => $data['titre']], $data);
        }

        $menus = [
            ['nom' => 'Menu du chef', 'description' => 'Une sélection maison avec nos plats signatures.', 'is_active' => true],
            ['nom' => 'Menu rafraîchissant', 'description' => 'Boissons et desserts pour clore le repas en beauté.', 'is_active' => true],
            ['nom' => 'Menu grillade', 'description' => 'Le meilleur du bœuf et du poulet braisé.', 'is_active' => true],
            ['nom' => 'ma selection', 'description' => '', 'is_active' => true],
            ['nom' => 'Maman', 'description' => '', 'is_active' => true],
            ['nom' => 'Ronald', 'description' => '', 'is_active' => true],
            ['nom' => 'LuLu', 'description' => '', 'is_active' => true],
        ];

        foreach ($menus as $menuData) {
            Menu::updateOrCreate(['nom' => $menuData['nom']], $menuData);
        }

        $menuMap = [
            'Bœuf' => Menu::where('nom', 'Menu grillade')->first()->id,
            'Poulet Braisé' => Menu::where('nom', 'Menu grillade')->first()->id,
            'Burgers' => Menu::where('nom', 'Menu du chef')->first()->id,
            'Pizzas' => Menu::where('nom', 'Menu du chef')->first()->id,
            'Tacos' => Menu::where('nom', 'Menu du chef')->first()->id,
            'Boissons' => Menu::where('nom', 'Menu rafraîchissant')->first()->id,
            'Desserts' => Menu::where('nom', 'Menu rafraîchissant')->first()->id,
        ];

        foreach (Plat::all() as $plat) {
            $plat->menu_id = $menuMap[$plat->categorie] ?? null;
            $plat->save();
        }

        SiteConfig::updateOrCreate(['id' => 1], [
            'brand_name' => 'BETHEL',
            'brand_accent' => 'GRILL',
            'hero_subtitle' => 'Grillades  & saveurs authentiques',
            'hero_title' => 'L\'excellence du détail, la passion du goût.',
            'hero_copy' => 'Découvrez nos grillades , commandez en direct et recevez une expérience culinaire unique.',
            'whatsapp_number' => '+242050970202',
            'hero_cta_label' => 'Voir le menu',
            'cart_open_label' => 'Voir mon panier',
            'menu_section_label' => 'NOS SECTIONS',
            'menu_section_title' => 'Explorez nos créations',
            'menu_section_description' => 'Naviguez parmi nos sections actives et découvrez des plats préparés pour éveiller vos sens.',
            'menu_cta_label' => 'Commander sur WhatsApp',
            'cart_clear_text' => 'Vider le panier',
            'cart_header' => 'Total',
            'cart_checkout_label' => 'Commander via WhatsApp',
        ]);

        $customers = [
            ['name' => 'oooo', 'phone' => '7777', 'email' => null, 'order_count' => 7, 'total_spent' => 131500, 'first_order_at' => '2026-07-10 11:35:33', 'last_order_at' => '2026-07-11 12:07:29'],
            ['name' => 'Laudes', 'phone' => '057612645', 'email' => null, 'order_count' => 4, 'total_spent' => 44000, 'first_order_at' => '2026-07-11 16:49:14', 'last_order_at' => '2026-07-11 17:42:19'],
            ['name' => 'Pamela', 'phone' => '057717777', 'email' => null, 'order_count' => 1, 'total_spent' => 12000, 'first_order_at' => '2026-07-11 18:55:41', 'last_order_at' => '2026-07-11 18:55:41'],
        ];

        foreach ($customers as $c) {
            Customer::updateOrCreate(['phone' => $c['phone']], $c);
        }

        $orders = [
            ['customer_name' => 'oooo', 'customer_phone' => '7777', 'total_amount' => 2500, 'status' => 'terminee', 'customer_id' => 1, 'cart_payload' => '[{"id":14,"title":"Limonade Dorée","quantity":1,"price":2500}]', 'whatsapp_message' => 'Bonjour BETHEL GRILL ! Je souhaite passer la commande suivante :\n\n- Limonade Dorée x1  (2 500 FCFA)\n\nTotal : 2 500 FCFA\n\nMerci !'],
            ['customer_name' => 'oooo', 'customer_phone' => '7777', 'total_amount' => 20000, 'status' => 'terminee', 'customer_id' => 1, 'cart_payload' => '[{"id":14,"title":"Limonade Dorée","quantity":2,"price":2500},{"id":16,"title":"Molten Choco Bomb","quantity":1,"price":4500},{"id":15,"title":"Jus de Bissap","quantity":1,"price":2000},{"id":9,"title":"Spicy Grilled Burger","quantity":1,"price":8500}]', 'whatsapp_message' => ''],
            ['customer_name' => 'oooo', 'customer_phone' => '7777', 'total_amount' => 40500, 'status' => 'terminee', 'customer_id' => 1, 'cart_payload' => '[{"id":3,"title":"Brochette de Bœuf Mariné","quantity":3,"price":7500},{"id":4,"title":"Poulet Braisé Sauce Arachide","quantity":1,"price":9500},{"id":8,"title":"BBQ Bacon Stack","quantity":1,"price":8500}]', 'whatsapp_message' => ''],
            ['customer_name' => 'oooo', 'customer_phone' => '7777', 'total_amount' => 4000, 'status' => 'terminee', 'customer_id' => 1, 'cart_payload' => '[{"id":18,"title":"mitard","quantity":1,"price":4000}]', 'whatsapp_message' => ''],
            ['customer_name' => 'Laudes', 'customer_phone' => '057612645', 'total_amount' => 14000, 'status' => 'terminee', 'customer_id' => 2, 'cart_payload' => '[{"id":15,"title":"Jus de Bissap","quantity":7,"price":2000}]', 'whatsapp_message' => ''],
            ['customer_name' => 'Laudes', 'customer_phone' => '057612645', 'total_amount' => 8000, 'status' => 'terminee', 'customer_id' => 2, 'cart_payload' => '[{"id":15,"title":"Jus de Bissap","quantity":4,"price":2000}]', 'whatsapp_message' => ''],
            ['customer_name' => 'Pamela', 'customer_phone' => '057717777', 'total_amount' => 12000, 'status' => 'en_attente', 'customer_id' => 3, 'cart_payload' => '[{"id":1,"title":"Grillade de Bœuf BBQ","quantity":1,"price":12000}]', 'whatsapp_message' => ''],
        ];

        foreach ($orders as $o) {
            Order::updateOrCreate(
                ['customer_phone' => $o['customer_phone'], 'total_amount' => $o['total_amount']],
                $o
            );
        }
    }
}
