<?php

namespace App\Filament\Resources\MenuResource\RelationManagers;

use Filament\Forms\Components\Card;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PlatsRelationManager extends RelationManager
{
    protected static string $relationship = 'plats';

    protected static ?string $recordTitleAttribute = 'titre';

    public function form(Form $form): Form
    {
        return $form->schema([
            Card::make()->schema([
                TextInput::make('titre')
                    ->label('Titre')
                    ->required()
                    ->maxLength(255),

                TextInput::make('prix')
                    ->label('Prix (FCFA)')
                    ->numeric()
                    ->required()
                    ->prefix('FCFA '),

                TextInput::make('description')
                    ->label('Description')
                    ->maxLength(500),

                TextInput::make('temps')
                    ->label('Temps de préparation')
                    ->numeric()
                    ->default(15)
                    ->suffix(' min'),

                TextInput::make('rating')
                    ->label('Note')
                    ->numeric()
                    ->step(0.1)
                    ->default(4.8),

                FileUpload::make('image')
                    ->label('Image')
                    ->image()
                    ->disk('public')
                    ->directory('plats')
                    ->preserveFilenames()
                    ->maxSize(2048),

                Toggle::make('is_bestseller')
                    ->label('Meilleure vente'),

                Toggle::make('is_promotion')
                    ->label('Promotion'),

                TextInput::make('promotion_prix')
                    ->label('Prix promotionnel (FCFA)')
                    ->numeric()
                    ->prefix('FCFA ')
                    ->visible(fn ($get) => $get('is_promotion')),

                Toggle::make('is_spicy')
                    ->label('Épicé'),
            ]),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('')
                    ->disk('public')
                    ->square()
                    ->height(40),
                TextColumn::make('titre')->label('Plat')->searchable(),
                TextColumn::make('prix')
                    ->label('Prix')
                    ->formatStateUsing(fn ($state) => number_format($state, 0, '.', ' ') . ' FCFA'),
                Tables\Columns\IconColumn::make('is_bestseller')
                    ->label('Vente')
                    ->boolean()
                    ->trueIcon('heroicon-o-fire')
                    ->falseIcon('heroicon-o-minus'),
                Tables\Columns\IconColumn::make('is_promotion')
                    ->label('Promo')
                    ->boolean()
                    ->trueIcon('heroicon-o-tag')
                    ->falseIcon('heroicon-o-minus'),
            ])
            ->filters([])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }
}
