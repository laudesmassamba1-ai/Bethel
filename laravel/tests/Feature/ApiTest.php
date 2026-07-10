<?php

namespace Tests\Feature;

use App\Models\Menu;
use App\Models\Plat;
use App\Models\SiteConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_plats_endpoint(): void
    {
        $menu = Menu::create(['nom' => 'Burgers', 'is_active' => true]);
        Plat::create([
            'titre' => 'Classic Burger',
            'prix' => 2500,
            'categorie' => 'Burgers',
            'menu_id' => $menu->id,
        ]);

        $response = $this->getJson('/api/plats');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_menus_endpoint(): void
    {
        Menu::create(['nom' => 'Burgers', 'is_active' => true]);

        $response = $this->getJson('/api/menus');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_config_endpoint(): void
    {
        $response = $this->getJson('/api/config');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['brand_name', 'brand_accent']]);
    }

    public function test_config_returns_defaults_when_empty(): void
    {
        $response = $this->getJson('/api/config');

        $response->assertOk()
            ->assertJsonFragment(['brand_name' => 'BETHEL']);
    }
}
