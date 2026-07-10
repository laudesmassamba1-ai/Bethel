<?php

namespace Tests\Feature;

use App\Models\Menu;
use App\Models\Plat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private function createPlat(array $overrides = []): Plat
    {
        $menu = Menu::create(['nom' => 'Burgers', 'is_active' => true]);

        return Plat::create(array_merge([
            'titre' => 'Classic Burger',
            'prix' => 2500,
            'categorie' => 'Burgers',
            'menu_id' => $menu->id,
        ], $overrides));
    }

    public function test_checkout_requires_cart(): void
    {
        $response = $this->postJson('/api/checkout', [
            'total' => 0,
        ]);

        $response->assertStatus(422);
    }

    public function test_checkout_rejects_empty_cart(): void
    {
        $response = $this->postJson('/api/checkout', [
            'cart' => [],
            'total' => 0,
        ]);

        $response->assertStatus(422);
    }

    public function test_checkout_creates_order(): void
    {
        $plat = $this->createPlat();

        $response = $this->postJson('/api/checkout', [
            'cart' => [
                ['id' => $plat->id, 'title' => $plat->titre, 'quantity' => 2, 'price' => $plat->prix],
            ],
            'total' => $plat->prix * 2,
            'message' => 'Test order',
        ]);

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('orders', [
            'total_amount' => $plat->prix * 2,
            'status' => 'en_attente',
        ]);
    }

    public function test_checkout_with_customer_phone(): void
    {
        $plat = $this->createPlat();

        $response = $this->postJson('/api/checkout', [
            'cart' => [
                ['id' => $plat->id, 'title' => $plat->titre, 'quantity' => 1, 'price' => $plat->prix],
            ],
            'total' => $plat->prix,
            'customer_name' => 'Jean Dupont',
            'customer_phone' => '22990123456',
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('customers', [
            'phone' => '22990123456',
            'name' => 'Jean Dupont',
        ]);
    }

    public function test_checkout_with_customer_email_fallback(): void
    {
        $plat = $this->createPlat();

        $response = $this->postJson('/api/checkout', [
            'cart' => [
                ['id' => $plat->id, 'title' => $plat->titre, 'quantity' => 1, 'price' => $plat->prix],
            ],
            'total' => $plat->prix,
            'customer_name' => 'Marie Curie',
            'customer_email' => 'marie@example.com',
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('customers', [
            'email' => 'marie@example.com',
            'name' => 'Marie Curie',
        ]);
    }

    public function test_checkout_rejects_nonexistent_plat(): void
    {
        $response = $this->postJson('/api/checkout', [
            'cart' => [
                ['id' => 9999, 'title' => 'Ghost', 'quantity' => 1, 'price' => 1000],
            ],
            'total' => 1000,
        ]);

        $response->assertStatus(422);
    }

    public function test_checkout_rate_limiting(): void
    {
        $plat = $this->createPlat();

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/checkout', [
                'cart' => [
                    ['id' => $plat->id, 'title' => $plat->titre, 'quantity' => 1, 'price' => $plat->prix],
                ],
                'total' => $plat->prix,
            ])->assertOk();
        }

        $this->postJson('/api/checkout', [
            'cart' => [
                ['id' => $plat->id, 'title' => $plat->titre, 'quantity' => 1, 'price' => $plat->prix],
            ],
            'total' => $plat->prix,
        ])->assertStatus(429);
    }
}
