<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteConfigResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'brand_name' => $this->brand_name,
            'brand_accent' => $this->brand_accent,
            'hero_subtitle' => $this->hero_subtitle,
            'hero_title' => $this->hero_title,
            'hero_copy' => $this->hero_copy,
            'whatsapp_number' => $this->whatsapp_number,
            'hero_cta_label' => $this->hero_cta_label,
            'cart_open_label' => $this->cart_open_label,
            'menu_section_label' => $this->menu_section_label,
            'menu_section_title' => $this->menu_section_title,
            'menu_section_description' => $this->menu_section_description,
            'menu_cta_label' => $this->menu_cta_label,
            'cart_clear_text' => $this->cart_clear_text,
            'cart_header' => $this->cart_header,
            'cart_checkout_label' => $this->cart_checkout_label,
        ];
    }
}
