<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class SiteConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_name',
        'brand_accent',
        'hero_subtitle',
        'hero_title',
        'hero_copy',
        'whatsapp_number',
        'hero_cta_label',
        'cart_open_label',
        'menu_section_label',
        'menu_section_title',
        'menu_section_description',
        'menu_cta_label',
        'cart_clear_text',
        'cart_header',
        'cart_checkout_label',
    ];

    public static function current(): self
    {
        if (! Schema::hasTable((new static())->getTable())) {
            return new static(self::defaults());
        }

        return static::first() ?? new static(self::defaults());
    }

    public static function defaults(): array
    {
        return [
            'brand_name' => 'BETHEL',
            'brand_accent' => 'KITCHEN',
            'hero_subtitle' => 'Cuisine authentique & ambiance cel-shading',
            'hero_title' => 'Saveurs puissantes, design audacieux.',
            'hero_copy' => 'Découvrez notre menu premium, commandez en direct et recevez une expérience culinaire visuelle et gourmande.',
            'whatsapp_number' => '237690788315',
            'hero_cta_label' => 'Voir le menu',
            'cart_open_label' => 'Voir mon panier',
            'menu_section_label' => 'NOS SECTIONS',
            'menu_section_title' => 'Explorez nos créations',
            'menu_section_description' => 'Naviguez parmi nos sections actives et découvrez des plats préparés pour éveiller vos sens.',
            'menu_cta_label' => 'Commander sur WhatsApp',
            'cart_clear_text' => 'Vider le panier',
            'cart_header' => 'Total',
            'cart_checkout_label' => 'Commander via WhatsApp',
        ];
    }
}
