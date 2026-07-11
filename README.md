# Bethel Kitchen / Grill - Menu Book 3D

**Site web de restaurant avec menu interactif en 3D** - une experience immersive qui reproduit un livre physique avec des pages qui se tournent, des ingredients 3D flottants, et un fond anime par shader.

![Version](https://img.shields.io/badge/version-1.0.0-19B000?style=flat-square)

---

## Apercu

| | |
|---|---|
| **Frontend** | React 18 + Vite 6 + Tailwind CSS v4 |
| **Backend** | Laravel 11 (API REST) |
| **3D** | Three.js + React Three Fiber + ShaderGradient |
| **Animations** | Motion (Framer Motion v12) + StPageFlip |

Le site présente un **livre de menu** realiste : une couverture noire sobre avec logo liquide 3D, des pages qui se tournent avec un effet 3D (ombre, perspective, pliage de coin), et un arriere-plan anime vert/noir avec des ingredients flottants en Three.js.

---

## Objectif

Creer une **commande en ligne** pour le restaurant Bethel Kitchen/Grill avec une **identite visuelle forte** : l'experience doit ressembler a un vrai menu de restaurant physique, avec du relief, de la profondeur, et des effets visuels premium.

---

## Fonctionnalites

- **Livre 3D feuilletable** - pages qui se tournent avec un effet realiste (bibliotheque `StPageFlip`)
- **Fond anime** - shader liquide vert/noir avec `@shadergradient/react`
- **Ingredients 3D flottants** - poivron, tomate, oignon, cornichon, fromage qui flottent et tournent avec parallaxe a la souris (Three.js)
- **Logo metal liquide** - effet metaball sur la couverture (`@paper-design/shaders-react`)
- **Panier** - tiroir coulissant avec gestion des quantites, total, et persistance locale
- **Responsive** - s'adapte a tous les ecrans
- **WhatsApp** - commande directe via WhatsApp
- **Donnees de secours** - menu affiche meme si le backend Laravel est indisponible (timeout 4s)
- **Administration** - panneau d'administration pour gerer les plats, commandes, et statistiques

---

## Architecture

```
bethel-kitchen/
├── src/
│   ├── app/
│   │   ├── App.tsx                  # Routes + Providers
│   │   ├── layouts/
│   │   │   └── RootLayout.tsx       # Layout global (navbar, footer, panier)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx         # Page d'accueil (livre + fond 3D)
│   │   │   ├── CheckoutPage.tsx     # Page de commande
│   │   │   ├── LoginPage.tsx        # Connexion admin
│   │   │   ├── AdminPage.tsx        # Dashboard admin
│   │   │   └── NotFoundPage.tsx     # Erreur 404
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── FloatingIngredients3D.tsx  # Ingredients Three.js flottants
│   │   │   │   ├── LuxuryBackground.tsx       # Fond shader vert/noir
│   │   │   │   ├── LiquidBrandLogo.tsx        # Logo metal liquide
│   │   │   │   └── LiquidMorph3D.tsx          # Morphing liquide (bonus)
│   │   │   ├── menu/
│   │   │   │   ├── BookMenu.tsx        # Livre feuilletable (react-pageflip)
│   │   │   │   ├── PlatDetailModal.tsx # Modale detail d'un plat
│   │   │   │   └── MenuBooklet.tsx     # Version alternative (non utilisee)
│   │   │   ├── cart/
│   │   │   │   ├── CartDrawer.tsx      # Tiroir panier
│   │   │   │   ├── FloatingCart.tsx    # Bouton panier flottant
│   │   │   │   └── FloatingWhatsApp.tsx
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx       # Barre de navigation
│   │   │       └── Footer.tsx       # Pied de page
│   │   ├── context/
│   │   │   ├── CartContext.tsx      # Etat du panier (localStorage)
│   │   │   ├── AuthContext.tsx      # Authentification admin
│   │   │   ├── CategoriesContext.tsx # Categories du menu
│   │   │   └── SiteConfigContext.tsx # Configuration du site
│   │   ├── hooks/
│   │   │   └── useScrollPosition.ts
│   │   └── utils/
│   │       ├── api.ts              # Appels API Laravel
│   │       └── constants.ts        # Types, helpers, constantes
│   └── styles/
│       ├── theme.css               # Variables CSS, couleurs
│       ├── tailwind.css            # Import Tailwind
│       ├── index.css               # Styles globaux
│       └── fonts.css               # Polices (Montserrat, Open Sans)
├── laravel/                        # Backend Laravel 11
└── package.json
```

---

## Technologies

### Frontend

| Technologie | Version | Usage |
|---|---|---|
| React | 18.3.1 | UI Framework |
| Vite | 6.3.5 | Build tool / HMR |
| Tailwind CSS | 4.1.12 | Styles utilitaires |
| Motion (Framer Motion) | 12.23.24 | Animations fluides |
| Three.js | 0.185.1 | Rendu 3D |
| @react-three/fiber | 8.17.10 | React + Three.js |
| @shadergradient/react | 2.4.20 | Fond shader liquide |
| @paper-design/shaders-react | 0.0.77 | Effets metaball/liquide |
| react-pageflip | 2.0.3 | Effet de page qui se tourne |
| page-flip (StPageFlip) | 2.0.7 | Moteur de feuilletage realiste |
| react-router | 7.13.0 | Routage |
| lucide-react | 1.24.0 | Icones |
| sonner | 2.0.3 | Toasts de notification |
| react-helmet-async | 3.x | SEO (balises meta) |

### Backend (Laravel 11)

| Technologie | Usage |
|---|---|
| Laravel 11 | API REST |
| Sanctum | Auth token |
| MySQL | Base de donnees |

---

## Palette de couleurs

| Couleur | Code | Usage |
|---|---|---|
| Vert principal | `#19B000` | Branding, accents, boutons |
| Noir | `#000000` | Texte, fonds |
| Beige | `#F5F1EA` | Fond des pages |
| Rouge doux (gradient) | `RG` | Accents discrets, badges promo |
| Jaune doux (gradient) | `JG` | Etoiles, accents dores |
| Bois fonce | `#2C1810` | Fond table (autres pages) |

### Polices
- **Montserrat** - Titres, navigation, boutons
- **Open Sans** - Corps de texte, descriptions

---

## Routes

| URL | Page | Description |
|---|---|---|
| `/` | HomePage | Livre de menu 3D |
| `/checkout` | CheckoutPage | Finalisation de commande |
| `/login` | LoginPage | Connexion administrateur |
| `/dashboard` | AdminPage | Gestion des plats/commandes/stats |
| `/*` | NotFoundPage | Erreur 404 |

---

## Installation

```bash
# Frontend
npm install
npm run dev          # -> http://localhost:5173

# Backend (Laravel)
cd laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve    # -> http://localhost:8000
```

### Build production

```bash
npm run build        # -> laravel/public/dist/
```

---

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Demarre le serveur de dev Vite |
| `npm run build` | Build de production |
| `npm run preview` | Previsualisation du build |
| `npx tsc --noEmit` | Verification TypeScript |

---

## Donnees de secours (FALLBACK_ITEMS)

Quand le backend Laravel est indisponible (timeout 4s), le menu affiche 8 plats de demonstration :
- 2 Burgers, 2 Pizzas, 2 Tacos, 1 Dessert, 1 Boisson

Cela permet de toujours voir le menu et de tester les fonctionnalites.

---

## Inspiration & References

- [StPageFlip](https://github.com/Nodlik/StPageFlip) - Bibliotheque de feuilletage (800+ stars)
- [turngl](https://github.com/oguzhanT/turngl) - Flipbook WebGL/Three.js
- [react-3d-flipbook](https://github.com/hdn-james/react-flipbook) - Flipbook React Three.js
- [Codrops 3D Restaurant Menu](https://tympanus.net/codrops/2012/09/25/3d-restaurant-menu-concept/)
- [mesh3d.gallery](https://mesh3d.gallery/) - Galerie de sites Three.js
- [Lusion](https://lusion.co/) / [Unseen Studio](https://unseen.co/) - Studios d'excellence 3D web

---

## Licence

MIT
