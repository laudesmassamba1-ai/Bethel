<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Notifications\Notification;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('livrer')
                ->label("C'est livré !")
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->visible(fn ($record): bool => $record->status === 'en_attente')
                ->requiresConfirmation()
                ->modalHeading('Confirmer la livraison')
                ->modalDescription(fn ($record): string =>
                    "Client : {$record->customer_name} | Montant : " . number_format($record->total_amount, 0, '.', ' ') . " FCFA"
                )
                ->modalSubmitActionLabel('Oui, livrer')
                ->action(fn ($record) => OrderResource::markAsDelivered($record)),

            Actions\Action::make('revenir_en_attente')
                ->label('Revenir en attente')
                ->icon('heroicon-o-arrow-uturn-left')
                ->color('warning')
                ->visible(fn ($record): bool => $record->status === 'terminee')
                ->requiresConfirmation()
                ->modalHeading("Revenir en attente")
                ->modalDescription("Annuler la livraison et remettre la commande en attente. Les statistiques client seront décrémentées.")
                ->modalSubmitActionLabel('Oui, revenir en attente')
                ->action(function ($record) {
                    \Illuminate\Support\Facades\DB::transaction(function () use ($record) {
                        $customer = $record->customer;
                        if ($customer) {
                            $customer->order_count = max(0, $customer->order_count - 1);
                            $customer->total_spent = max(0, $customer->total_spent - $record->total_amount);
                            $customer->save();
                        }
                        $record->update(['status' => 'en_attente']);
                    });

                    Notification::make()
                        ->title("Commande #{$record->id} remise en attente")
                        ->warning()
                        ->send();
                }),

            Actions\Action::make('annuler')
                ->label('Annuler')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->visible(fn ($record): bool => $record->status === 'en_attente')
                ->requiresConfirmation()
                ->modalHeading('Annuler la commande')
                ->modalDescription('Le client a annulé sa commande ? Elle ne sera pas comptabilisée dans les statistiques.')
                ->modalSubmitActionLabel('Oui, annuler')
                ->action(function ($record) {
                    $record->update(['status' => 'annulee']);
                    Notification::make()
                        ->title("Commande #{$record->id} annulée")
                        ->body("Cette commande n'est pas comptabilisée dans les stats.")
                        ->warning()
                        ->send();
                }),

            Actions\Action::make('imprimer')
                ->label('Imprimer le ticket')
                ->icon('heroicon-o-printer')
                ->color('info')
                ->url(fn ($record): string => route('ticket', ['order' => $record->id]))
                ->openUrlInNewTab(),
        ];
    }
}
