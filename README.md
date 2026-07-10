# Bethel Kitchen 🍔🍕

Application de commande de repas en ligne avec menu, panier et passage de commande via WhatsApp.

## Stack

- **Frontend** : React 18, Vite 6, Tailwind CSS 4, Motion, shadcn/ui
- **Backend** : Laravel 11, Filament 3 (admin), SQLite
- **Design** : Cel-shading / comic-style

## Installation

```bash
# Frontend
npm install
npm run dev          # → http://localhost:5173

# Backend (dans laravel/)
cd laravel
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --force
php artisan serve    # → http://localhost:8000
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Page d'accueil — menu, panier, commande WhatsApp |
| `/login` | Connexion admin |
| `/admin` | Panneau d'administration React |
| `/admin` (Laravel) | Filament admin (CRUD plats, menus, commandes, config) |

## API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/plats` | GET | Liste des plats |
| `/api/menus` | GET | Menus actifs |
| `/api/config` | GET | Configuration du site |
| `/api/checkout` | POST | Enregistrer une commande |
| `/api/login` | POST | Connexion admin |
| `/api/me` | GET | Infos utilisateur (auth) |
| `/api/logout` | POST | Déconnexion (auth) |

## Fonctionnalités

- Menu interactif avec filtres par catégorie et recherche
- Panier avec persistance localStorage
- Commande via WhatsApp avec message généré automatiquement
- Interface d'administration Filament (gestion des plats, menus, commandes)
- Dashboard avec métriques des commandes
