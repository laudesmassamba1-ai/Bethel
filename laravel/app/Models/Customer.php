<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'order_count',
        'total_spent',
        'first_order_at',
        'last_order_at',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function getLoyaltyTierAttribute(): string
    {
        return match (true) {
            $this->order_count >= 20 => 'Or',
            $this->order_count >= 10 => 'Argent',
            $this->order_count >= 5  => 'Bronze',
            default                  => 'Nouveau',
        };
    }

    public function getLoyaltyColorAttribute(): string
    {
        return match ($this->loyalty_tier) {
            'Or'     => '#D4AF37',
            'Argent' => '#9E9E9E',
            'Bronze' => '#CD7F32',
            default  => '#6B6357',
        };
    }
}
