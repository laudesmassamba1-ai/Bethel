<?php

namespace App\Models;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modele Eloquent `Plat`.
 *
 * Proprietes : `titre`, `prix`, `categorie`, `image`, `is_bestseller`.
 */
class Plat extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'prix',
        'categorie',
        'image',
        'menu_id',
        'is_bestseller',
        'is_promotion',
        'promotion_prix',
        'temps',
        'rating',
        'is_spicy',
    ];

    protected $casts = [
        'prix' => 'integer',
        'promotion_prix' => 'integer',
        'is_bestseller' => 'boolean',
        'is_promotion' => 'boolean',
        'is_spicy' => 'boolean',
        'rating' => 'float',
    ];

    protected static function booted(): void
    {
        static::creating(function (Plat $plat) {
            if (!$plat->categorie && $plat->menu_id) {
                $menu = $plat->menu()->withoutGlobalScopes()->first();
                $plat->categorie = $menu?->nom ?? '';
            }
            if (!$plat->categorie) {
                $plat->categorie = '';
            }
        });

        static::updating(function (Plat $plat) {
            if ($plat->isDirty('menu_id') && !$plat->isDirty('categorie')) {
                $menu = $plat->menu()->withoutGlobalScopes()->first();
                $plat->categorie = $menu?->nom ?? '';
            }
        });
    }

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}
