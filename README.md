# AzFoodDelivery

Une application full-stack de livraison de nourriture construite avec Next.js et Express, offrant une expérience utilisateur fluide pour les clients et les propriétaires de restaurants.

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack Technologique](#stack-technologique)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Authentification](#authentification)
- [Développement](#développement)

## Aperçu

AzFoodDelivery est une plateforme moderne de livraison de nourriture qui connecte les clients avec leurs restaurants préférés. L'application supporte deux types d'utilisateurs avec des rôles distincts :

- **Clients** : Parcourir les restaurants, passer des commandes, et suivre les livraisons
- **Propriétaires de restaurants** : Gérer leurs restaurants, menus, et commandes depuis un dashboard dédié

## Fonctionnalités

### Pour les Clients
- ✅ Inscription et connexion sécurisées
- 🍽️ Navigation des restaurants par catégorie et type
- 🛒 Panier d'achat avec gestion des articles
- 📍 Zones de livraison par restaurant
- 🔍 Recherche et filtrage des restaurants

### Pour les Propriétaires de Restaurants
- 🏪 Inscription avec création automatique du restaurant
- 📊 Dashboard de gestion dédié
- 📝 Gestion du profil du restaurant
- 🏷️ Catégorisation et tags personnalisables

### Fonctionnalités Techniques
- 🔐 Authentification JWT avec rôles (RBAC)
- 🎨 Interface responsive avec Tailwind CSS
- ⚡ State management avec Redux Toolkit
- 📱 App Router de Next.js 16
- 🔄 Hydration optimisée (SSR/CSR)
- 🛡️ TypeScript pour le type safety

## Stack Technologique

### Frontend
- **Framework** : Next.js 16 (App Router)
- **UI Library** : React 19
- **State Management** : Redux Toolkit + React-Redux
- **Styling** : Tailwind CSS 4
- **HTTP Client** : Axios
- **Icons** : React Icons
- **Language** : TypeScript

### Backend
- **Runtime** : Node.js
- **Framework** : Express 5
- **Database** : MongoDB + Mongoose 9
- **Authentication** : JWT (jsonwebtoken)
- **Password Hashing** : bcrypt
- **CORS** : Enabled
- **Language** : TypeScript

## Architecture

Ce projet suit une architecture **monorepo** avec deux applications principales :

```
azfooddeliveryappp/
├── frontend/          # Application Next.js
├── backend/           # API Express
├── CLAUDE.md          # Documentation pour Claude Code
└── README.md          # Ce fichier
```

### Flux d'Authentification

```
Client → Frontend (Next.js) → Backend API (Express) → MongoDB
                ↓
         Redux Store (State Management)
                ↓
         LocalStorage (JWT Token)
```

## Installation

### Prérequis

- Node.js (v16 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Cloner le dépôt

```bash
git clone <repository-url>
cd azfooddeliveryappp
```

### 2. Installation Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend/` :

```env
MONGO_URI=mongodb://localhost:27017/azfooddelivery
SECRET_TOKEN=votre_secret_jwt_tres_securise
DEFAULT_PORT=5000
```

### 3. Installation Frontend

```bash
cd ../frontend
npm install
```

## Configuration

### Backend (.env)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGO_URI` | URI de connexion MongoDB | `mongodb://localhost:27017/azfooddelivery` |
| `SECRET_TOKEN` | Secret pour signer les JWT | `mysecretkey123` |
| `DEFAULT_PORT` | Port du serveur backend | `5000` |

### Frontend

La configuration du frontend se trouve dans :
- `frontend/tsconfig.json` - Configuration TypeScript
- `frontend/tailwind.config.ts` - Configuration Tailwind CSS
- `frontend/app/store/store.jsx` - Configuration Redux

## Utilisation

### Démarrer le Backend

```bash
cd backend
node server.js
```

Le serveur backend démarre sur `http://localhost:5000`

### Démarrer le Frontend

```bash
cd frontend
npm run dev
```

L'application frontend démarre sur `http://localhost:3000`

### Scripts Disponibles

#### Frontend

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Compiler pour la production
npm start        # Démarrer le serveur de production
npm run lint     # Linter le code
```

#### Backend

```bash
node server.js   # Démarrer le serveur
```

## Structure du Projet

### Frontend

```
frontend/
├── app/
│   ├── components/          # Composants React réutilisables
│   │   ├── layouts/         # Layout components (Navbar, Footer)
│   │   ├── AuthInit.tsx     # Initialisation de l'auth
│   │   ├── LoginForm.tsx    # Formulaire de connexion
│   │   └── RegisterForm.tsx # Formulaire d'inscription
│   ├── store/               # Configuration Redux
│   │   ├── slices/          # Redux slices (auth, cart, etc.)
│   │   ├── services/        # Services API
│   │   └── store.jsx        # Configuration du store
│   ├── types/               # Définitions TypeScript centralisées
│   │   ├── auth.types.ts    # Types d'authentification
│   │   ├── restaurant.types.ts # Types restaurant
│   │   └── index.ts         # Barrel file
│   ├── hooks.ts             # Hooks Redux typés
│   ├── login/               # Page de connexion
│   ├── register/            # Page d'inscription
│   ├── restaurantDashboard/ # Dashboard propriétaire
│   ├── layout.jsx           # Layout racine
│   └── page.jsx             # Page d'accueil
├── public/                  # Assets statiques
├── tsconfig.json            # Configuration TypeScript
└── tailwind.config.ts       # Configuration Tailwind
```

### Backend

```
backend/
├── config/
│   └── db.js                # Configuration MongoDB
├── controllers/
│   └── auth.js              # Contrôleurs d'authentification
├── middlewares/
│   └── auth.js              # Middleware JWT (protect)
├── models/
│   ├── User.js              # Modèle utilisateur
│   └── Restaurant.js        # Modèle restaurant
├── routes/
│   └── auth.js              # Routes d'authentification
├── .env                     # Variables d'environnement
└── server.js                # Point d'entrée
```

## API Endpoints

### Authentication

#### POST `/api/auth/register`

Inscription d'un nouvel utilisateur (et création du restaurant si role = restaurant_owner).

**Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  // Si role = "restaurant_owner", ajouter :
  "name": "Restaurant Name",
  "category": "Pizza",
  "type": "restaurant",
  "street": "123 Main St",
  "city": "Paris",
  "zipCode": "75001",
  "phone": "+33123456789",
  "deliveryZone": "5km"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "customer"
}
```

#### POST `/api/auth/login`

Connexion d'un utilisateur existant.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/me`

Récupérer l'utilisateur actuellement authentifié (route protégée).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Customer):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "customer"
}
```

**Response (Restaurant Owner):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "role": "restaurant_owner",
  "restaurant": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Pizza Palace",
    "category": "Pizza",
    "type": "restaurant",
    "owner": "507f1f77bcf86cd799439011",
    ...
  }
}
```

## Authentification

### Flow d'Authentification

1. **Inscription/Connexion** : L'utilisateur s'inscrit ou se connecte
2. **Génération du Token** : Le backend génère un JWT et le retourne
3. **Stockage du Token** : Le token est stocké dans `localStorage`
4. **Requêtes Authentifiées** : Le token est envoyé dans l'header `Authorization: Bearer <token>`
5. **Vérification** : Le middleware `protect` vérifie le token et attache `req.user`

### Roles et Permissions

| Role | Accès | Routes Protégées |
|------|-------|------------------|
| `customer` | Routes publiques + profil client | `/` |
| `restaurant_owner` | Routes publiques + dashboard restaurant | `/restaurantDashboard` |

### Middleware de Protection

```javascript
// backend/middlewares/auth.js
const protect = (req, res, next) => {
  // Vérifie le token JWT
  // Attache req.user si valide
  // Retourne 401 si invalide
}
```

## Développement

### Bonnes Pratiques

#### TypeScript
- ✅ Utiliser les types centralisés depuis `frontend/app/types/`
- ✅ Toujours typer les props des composants
- ✅ Utiliser les hooks typés : `useAppDispatch`, `useAppSelector`
- ✅ Éviter `any` - utiliser des types spécifiques

#### Redux
- ✅ Utiliser `createAsyncThunk` pour les actions async
- ✅ Centraliser les appels API dans `services/`
- ✅ Gérer les états pending/fulfilled/rejected

#### Composants React
- ✅ Utiliser le pattern `isMounted` pour éviter les erreurs d'hydration
- ✅ Vérifier `typeof window !== 'undefined'` avant d'accéder à `localStorage`
- ✅ Séparer la logique métier des composants UI

#### Sécurité
- ✅ Ne jamais commiter les fichiers `.env`
- ✅ Utiliser bcrypt pour hasher les mots de passe
- ✅ Valider les données côté backend ET frontend
- ✅ Éviter les injections SQL/NoSQL avec Mongoose

### Debugging

**Problèmes d'hydration** :
```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) return null;
```

**Problèmes de CORS** :
Le backend a CORS activé par défaut. Si vous rencontrez des problèmes, vérifiez la configuration dans `backend/server.js`.

**Token expiré** :
Le composant `AuthInit` gère automatiquement les tokens expirés en les supprimant de `localStorage`.

### Structure des Types

Les types TypeScript sont organisés par domaine :

- `auth.types.ts` : User, LoginCredentials, RegisterData, AuthState
- `restaurant.types.ts` : Restaurant, RestaurantFormState, Image
- `index.ts` : Barrel file pour imports simplifiés

Utilisation :
```typescript
import { User, Restaurant, LoginCredentials } from '@/app/types';
```

### Commandes Utiles

```bash
# Vérifier les types TypeScript (frontend)
cd frontend && npx tsc --noEmit

# Vérifier le linting (frontend)
cd frontend && npm run lint

# Construire pour production (frontend)
cd frontend && npm run build

# Démarrer en production (frontend)
cd frontend && npm start
```

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

Ce projet est sous licence privée.

---

Développé avec ❤️ par l'équipe AzFoodDelivery
