<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlatResource\Pages;
use App\Models\Plat;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

/**
 * Filament Resource pour gérer les CRUD de `Plat`.
 */
class PlatResource extends Resource
{
    protected static ?string $model = Plat::class;

    protected static ?string $navigationTitle = 'Plats';
    protected static ?string $navigationLabel = 'Plats';
    protected static ?string $navigationGroup = 'Restaurant';
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Card::make()->schema([
                    TextInput::make('titre')
                        ->label('Titre')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('prix')
                        ->label('Prix (FCFA)')
                        ->numeric()
                        ->required()
                        ->prefix('FCFA ')
                        ->helperText('Entrez le prix en FCFA, sans séparateur'),

                    TextInput::make('description')
                        ->label('Description')
                        ->maxLength(500),

                    Select::make('menu_id')
                        ->label('Catégorie')
                        ->relationship('menu', 'nom')
                        ->searchable()
                        ->preload()
                        ->nullable()
                        ->helperText('Sélectionnez la catégorie (Burgers, Pizzas, etc.)'),

                    FileUpload::make('image')
                        ->label('Photo du plat')
                        ->image()
                        ->disk('public')
                        ->directory('plats')
                        ->visibility('public')
                        ->imagePreviewHeight('200')
                        ->preserveFilenames()
                        ->maxSize(2048)
                        ->helperText('Format JPG/PNG, max 2 Mo'),

                    TextInput::make('temps')
                        ->label('Temps de préparation')
                        ->numeric()
                        ->default(15)
                        ->suffix(' min')
                        ->helperText('Temps moyen en minutes'),

                    Toggle::make('is_bestseller')
                        ->label('Meilleure vente')
                        ->helperText('Affiche le badge "BEST SELLER" sur le plat'),

                    Toggle::make('is_promotion')
                        ->label('Promotion')
                        ->helperText('Affiche le badge "PROMOTION" et un prix réduit'),

                    TextInput::make('promotion_prix')
                        ->label('Prix promotionnel (FCFA)')
                        ->numeric()
                        ->prefix('FCFA ')
                        ->required(fn ($get) => $get('is_promotion'))
                        ->visible(fn ($get) => $get('is_promotion'))
                        ->helperText('Prix spécial affiché lorsque la promotion est active'),

                    Toggle::make('is_spicy')
                        ->label('Épicé')
                        ->helperText('Affiche une icône "piment" sur le plat'),

                    TextInput::make('rating')
                        ->label('Note')
                        ->numeric()
                        ->step(0.1)
                        ->default(4.8)
                        ->helperText('Note sur 5 affichée sur la fiche plat'),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->disk('public')
                    ->square()
                    ->height(60),

                Tables\Columns\TextColumn::make('titre')
                    ->searchable()
                    ->label('Titre'),

                Tables\Columns\TextColumn::make('menu.nom')
                    ->label('Catégorie')
                    ->sortable()
                    ->badge()
                    ->color('warning'),

                Tables\Columns\TextColumn::make('prix')
                    ->label('Prix (FCFA)')
                    ->formatStateUsing(fn ($state) => number_format($state, 0, '.', ' ') . ' FCFA'),

                Tables\Columns\IconColumn::make('is_bestseller')
                    ->label('Meilleure vente')
                    ->boolean()
                    ->trueIcon('heroicon-o-fire')
                    ->falseIcon('heroicon-o-minus'),

                Tables\Columns\IconColumn::make('is_promotion')
                    ->label('Promo')
                    ->boolean()
                    ->trueIcon('heroicon-o-tag')
                    ->falseIcon('heroicon-o-minus'),
            ])
            ->defaultSort('menu.nom')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPlats::route('/'),
            'create' => Pages\CreatePlat::route('/create'),
            'edit' => Pages\EditPlat::route('/{record}/edit'),
        ];
    }
}
