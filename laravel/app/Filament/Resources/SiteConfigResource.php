<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SiteConfigResource\Pages;
use App\Models\SiteConfig;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SiteConfigResource extends Resource
{
    protected static ?string $model = SiteConfig::class;

    protected static ?string $navigationLabel = 'Paramètres';
    protected static ?string $navigationGroup = 'Restaurant';
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Card::make()->schema([
                TextInput::make('brand_name')
                    ->label('Nom de marque')
                    ->required()
                    ->maxLength(255),

                TextInput::make('brand_accent')
                    ->label('Accent du logo')
                    ->required()
                    ->maxLength(255),

                TextInput::make('hero_subtitle')
                    ->label('Sous-titre du hero')
                    ->required()
                    ->maxLength(255),

                TextInput::make('hero_title')
                    ->label('Titre principal')
                    ->required()
                    ->maxLength(255),

                Textarea::make('hero_copy')
                    ->label('Texte du hero')
                    ->rows(4)
                    ->required(),

                TextInput::make('whatsapp_number')
                    ->label('Numéro WhatsApp')
                    ->required()
                    ->maxLength(32)
                    ->helperText('Entrez le numéro sans espaces ni signes, ex: 22900000000'),
                TextInput::make('hero_cta_label')
                    ->label('Libellé du bouton hero')
                    ->required()
                    ->maxLength(64),

                TextInput::make('cart_open_label')
                    ->label('Texte du bouton panier mobile')
                    ->required()
                    ->maxLength(64),

                TextInput::make('menu_section_label')
                    ->label('Libellé du titre des sections')
                    ->required()
                    ->maxLength(64),

                TextInput::make('menu_section_title')
                    ->label('Titre de la section menu')
                    ->required()
                    ->maxLength(128),

                Textarea::make('menu_section_description')
                    ->label('Description de la section menu')
                    ->rows(3)
                    ->required(),

                TextInput::make('menu_cta_label')
                    ->label('Libellé du bouton commander')
                    ->required()
                    ->maxLength(64),

                TextInput::make('cart_clear_text')
                    ->label('Texte du bouton vider le panier')
                    ->required()
                    ->maxLength(64),

                TextInput::make('cart_header')
                    ->label('Titre du total du panier')
                    ->required()
                    ->maxLength(64),

                TextInput::make('cart_checkout_label')
                    ->label('Libellé du bouton commander')
                    ->required()
                    ->maxLength(64),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('brand_name')->label('Nom de marque'),
                TextColumn::make('brand_accent')->label('Accent'),
                TextColumn::make('whatsapp_number')->label('WhatsApp'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSiteConfigs::route('/'),
            'create' => Pages\CreateSiteConfig::route('/create'),
            'edit' => Pages\EditSiteConfig::route('/{record}/edit'),
        ];
    }
}
