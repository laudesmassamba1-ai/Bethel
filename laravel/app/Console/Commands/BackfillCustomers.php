<?php

namespace App\Console\Commands;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Console\Command;

class BackfillCustomers extends Command
{
    protected $signature = 'customers:backfill';
    protected $description = 'Créer des enregistrements clients à partir des commandes existantes';

    public function handle(): int
    {
        $orders = Order::whereNull('customer_id')->get();
        $count = 0;

        foreach ($orders as $order) {
            $phone = $order->customer_phone;
            if (!$phone) continue;

            $customer = Customer::firstOrCreate(
                ['phone' => $phone],
                ['name' => $order->customer_name],
            );

            $order->customer_id = $customer->id;
            $order->save();

            $customer->order_count = $customer->orders()->count();
            $customer->total_spent = (int) $customer->orders()->sum('total_amount');
            $customer->first_order_at = $customer->orders()->min('created_at');
            $customer->last_order_at = $customer->orders()->max('created_at');
            $customer->save();

            $count++;
        }

        $this->info("{$count} commandes liées à des clients.");
        return Command::SUCCESS;
    }
}