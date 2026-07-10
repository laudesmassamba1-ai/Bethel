<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use App\Filament\Widgets\OrdersChart;
use App\Filament\Widgets\OrdersSummary;
use App\Filament\Widgets\RecentOrdersTable;
use App\Filament\Widgets\RevenueChart;
use App\Filament\Widgets\StatsOverview;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Amber,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
                StatsOverview::class,
                OrdersSummary::class,
                OrdersChart::class,
                RevenueChart::class,
                RecentOrdersTable::class,
            ])
            ->navigationItems([
                \Filament\Navigation\NavigationItem::make('Tableau de bord React')
                    ->url('/dashboard', true)
                    ->icon('heroicon-o-presentation-chart-bar')
                    ->group('Administration')
                    ->sort(1),
            ])
            ->userMenuItems([
                \Filament\Navigation\MenuItem::make()
                    ->label('Tableau de bord React')
                    ->url('/dashboard', true)
                    ->icon('heroicon-o-presentation-chart-bar'),
                \Filament\Navigation\MenuItem::make()
                    ->label('Retour au site')
                    ->url('/', true)
                    ->icon('heroicon-o-arrow-left-on-rectangle'),
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
                \App\Http\Middleware\EnsureIsAdmin::class,
            ]);
    }
}
