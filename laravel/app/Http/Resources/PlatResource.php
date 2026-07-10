<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $badge = null;
        if ($this->is_bestseller) {
            $badge = 'BEST SELLER';
        }
        if ($this->is_promotion) {
            $badge = 'PROMOTION';
        }

        return [
            'id' => $this->id,
            'name' => $this->titre,
            'description' => $this->description ?? '',
            'price' => (int) $this->prix,
            'original_price' => $this->is_promotion && $this->promotion_prix ? (int) $this->prix : null,
            'category' => $this->menu?->nom ?? $this->categorie,
            'image' => $this->image
                ? (str_starts_with($this->image, 'http') ? $this->image : asset('storage/' . $this->image))
                : '',
            'badge' => $badge,
            'is_bestseller' => (bool) $this->is_bestseller,
            'is_promotion' => (bool) $this->is_promotion,
            'promotion_prix' => $this->is_promotion ? (int) ($this->promotion_prix ?? $this->prix) : null,
            'spicy' => (bool) $this->is_spicy,
            'rating' => (float) ($this->rating ?? 4.8),
            'time' => ($this->temps ?? 15) . ' min',
            'menu_id' => $this->menu_id,
        ];
    }
}
