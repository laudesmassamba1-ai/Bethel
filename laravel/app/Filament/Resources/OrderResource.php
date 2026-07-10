<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationLabel = 'Commandes';
    protected static ?string $navigationGroup = 'Restaurant';
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static bool $canCreate = false;
    protected static bool $canEdit = false;
    protected static bool $canDelete = false;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Card::make()->schema([
                Grid::make(2)->schema([
                    TextInput::make('id')->disabled()->label('Commande #'),
                    TextInput::make('status')
                        ->disabled()
                        ->label('Statut')
                        ->formatStateUsing(fn ($state) => match ($state) {
                            'en_attente' => 'En attente',
                            'terminee' => 'Terminée',
                            'annulee' => 'Annulée',
                            default => $state,
                        }),
                    TextInput::make('customer_name')->disabled()->label('Client'),
                    TextInput::make('customer_phone')->disabled()->label('Téléphone'),
                ]),
                Placeholder::make('loyalty_info')
                    ->label('Fidélité')
                    ->content(fn ($record) => $record && $record->customer
                        ? "{$record->customer->name} — {$record->customer->loyalty_tier} ({$record->customer->order_count} commandes)"
                        : 'Client anonyme'),
                TextInput::make('total_amount')
                    ->label('Total (FCFA)')
                    ->disabled()
                    ->formatStateUsing(fn ($state) => number_format($state, 0, '.', ' ') . ' FCFA'),
                Placeholder::make('items_list')
                    ->label('Articles commandés')
                    ->content(function ($record) {
                        if (!$record || !$record->items->count()) {
                            return 'Aucun article';
                        }
                        $html = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
                        $html .= '<thead><tr style="border-bottom:2px solid #1D1D1D;">';
                        $html .= '<th style="padding:6px 8px;text-align:left;">Plat</th>';
                        $html .= '<th style="padding:6px 8px;text-align:center;width:60px;">Qte</th>';
                        $html .= '<th style="padding:6px 8px;text-align:right;width:120px;">Prix unit.</th>';
                        $html .= '<th style="padding:6px 8px;text-align:right;width:120px;">Total</th>';
                        $html .= '</tr></thead><tbody>';
                        foreach ($record->items as $item) {
                            $total = $item->quantity * $item->unit_price;
                            $html .= '<tr style="border-bottom:1px solid #E5DCC6;">';
                            $html .= '<td style="padding:6px 8px;font-weight:700;">' . e($item->plat?->titre ?? 'Plat #' . $item->plat_id) . '</td>';
                            $html .= '<td style="padding:6px 8px;text-align:center;">x' . $item->quantity . '</td>';
                            $html .= '<td style="padding:6px 8px;text-align:right;">' . number_format($item->unit_price, 0, '.', ' ') . ' FCFA</td>';
                            $html .= '<td style="padding:6px 8px;text-align:right;font-weight:800;">' . number_format($total, 0, '.', ' ') . ' FCFA</td>';
                            $html .= '</tr>';
                        }
                        $html .= '</tbody></table>';
                        return new \Illuminate\Support\HtmlString($html);
                    }),
                Textarea::make('whatsapp_message')
                    ->label('Message WhatsApp')
                    ->rows(4)
                    ->disabled(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('Commande')->sortable(),
                TextColumn::make('created_at')
                    ->label('Passee le')
                    ->since()
                    ->sortable(),
                TextColumn::make('items_count')
                    ->label('Articles')
                    ->counts('items'),
                TextColumn::make('customer_name')->label('Client'),
                TextColumn::make('total_amount')
                    ->label('Montant')
                    ->formatStateUsing(fn ($state) => number_format($state, 0, '.', ' ') . ' FCFA')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'en_attente' => 'warning',
                        'terminee' => 'success',
                        'annulee' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'en_attente' => 'En attente',
                        'terminee' => 'Terminée',
                        'annulee' => 'Annulée',
                        default => $state,
                    }),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'en_attente' => 'En attente',
                        'terminee' => 'Terminée',
                        'annulee' => 'Annulée',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),

                Tables\Actions\Action::make('livrer')
                    ->label("C'est livré !")
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Order $record): bool => $record->status === 'en_attente')
                    ->requiresConfirmation()
                    ->modalHeading('Confirmer la livraison')
                    ->modalDescription(fn (Order $record): string =>
                        "Client : {$record->customer_name} | Montant : " . number_format($record->total_amount, 0, '.', ' ') . " FCFA"
                    )
                    ->modalSubmitActionLabel('Oui, livrer')
                    ->action(function (Order $record) {
                        self::markAsDelivered($record);
                    }),

                Tables\Actions\Action::make('revenir_en_attente')
                    ->label('Revenir en attente')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->visible(fn (Order $record): bool => $record->status === 'terminee')
                    ->requiresConfirmation()
                    ->modalHeading("Revenir en attente")
                    ->modalDescription("Annuler la livraison et remettre la commande en attente. Les statistiques client seront décrémentées.")
                    ->modalSubmitActionLabel('Oui, revenir en attente')
                    ->action(function (Order $record) {
                        DB::transaction(function () use ($record) {
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

                Tables\Actions\Action::make('annuler')
                    ->label('Annuler')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (Order $record): bool => $record->status === 'en_attente')
                    ->requiresConfirmation()
                    ->modalHeading('Annuler la commande')
                    ->modalDescription('Le client a annulé sa commande ? Elle ne sera pas comptabilisée dans les statistiques.')
                    ->modalSubmitActionLabel('Oui, annuler')
                    ->action(function (Order $record) {
                        $record->update(['status' => 'annulee']);
                        Notification::make()
                        ->title('Commande #' . $record->id . ' annulée')
                        ->body('Cette commande n\'est pas comptabilisée dans les stats.')
                            ->warning()
                            ->send();
                    }),

                Tables\Actions\Action::make('imprimer')
                    ->label('Ticket')
                    ->icon('heroicon-o-printer')
                    ->color('info')
                    ->url(fn (Order $record): string => route('ticket', ['order' => $record->id]))
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([]);
    }

    public static function markAsDelivered(Order $order): void
    {
        if ($order->status !== 'en_attente') {
            Notification::make()
                ->title("Impossible de livrer la commande #{$order->id}")
                ->body("Son statut actuel est \"{$order->status}\".")
                ->danger()
                ->send();
            return;
        }

        DB::transaction(function () use ($order) {
            $order->update(['status' => 'terminee']);

            $customer = $order->customer;
            if ($customer) {
                $customer->order_count++;
                $customer->total_spent += $order->total_amount;
                if (!$customer->first_order_at) {
                    $customer->first_order_at = $order->created_at;
                }
                $customer->last_order_at = $order->created_at;
                $customer->save();
            }

            Notification::make()
                ->title('Commande #' . $order->id . ' livrée')
                ->body('Le client a été comptabilisé : +1 commande, +' . number_format($order->total_amount, 0, '.', ' ') . ' FCFA')
                ->success()
                ->send();
        });
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
        ];
    }
}
