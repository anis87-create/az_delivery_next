# Guide de Démarrage Rapide - AzFoodDelivery

## 🚀 Démarrage Rapide

### Prérequis
- Node.js v16+
- MongoDB (local ou Atlas)
- npm

---

## 📦 Installation

### 1. Backend

```bash
cd backend
npm install
```

Créer le fichier `.env`:
```env
MONGO_URI=mongodb+srv://votre-uri-mongodb
SECRET_TOKEN=votre_secret_jwt_securise
DEFAULT_PORT=5000
```

### 2. Frontend

```bash
cd frontend
npm install
```

---

## 🏃 Lancer l'Application

### Démarrer le Backend

```bash
cd backend
npx ts-node server.ts
```

Ou avec nodemon (développement):
```bash
npx nodemon --exec npx ts-node server.ts
```

Le serveur démarre sur: `http://localhost:5000`

### Démarrer le Frontend

```bash
cd frontend
npm run dev
```

L'application démarre sur: `http://localhost:3000`

---

## 🧪 Vérifications

### Backend

```bash
# Vérifier la compilation TypeScript
cd backend
npx tsc --noEmit

# Tester la connexion MongoDB
# Le serveur doit afficher "MongoDB connected" au démarrage
```

### Frontend

```bash
# Vérifier la compilation TypeScript
cd frontend
npx tsc --noEmit

# Vérifier le linting
npm run lint
```

---

## 🔑 Premiers Pas

### 1. Créer un compte client

1. Ouvrir `http://localhost:3000/register`
2. Remplir le formulaire
3. Sélectionner "Customer" comme type d'utilisateur
4. S'inscrire

### 2. Créer un compte propriétaire de restaurant

1. Ouvrir `http://localhost:3000/register`
2. Remplir le formulaire utilisateur
3. Sélectionner "Restaurant Owner"
4. Remplir les informations du restaurant
5. S'inscrire

### 3. Se connecter

1. Ouvrir `http://localhost:3000/login`
2. Entrer email et mot de passe
3. Vous serez redirigé selon votre rôle:
   - **Customer**: Page d'accueil
   - **Restaurant Owner**: Dashboard restaurant

---

## 📱 Routes Disponibles

### Routes Publiques
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/restaurant/[id]` - Détails d'un restaurant

### Routes Protégées
- `/restaurantDashboard` - Dashboard propriétaire (restaurant_owner uniquement)

---

## 🐛 Résolution de Problèmes

### Le backend ne démarre pas

**Erreur: "MongoDB connection error"**
```bash
# Vérifier que MONGO_URI est correct dans .env
# Vérifier que MongoDB est accessible
```

**Erreur: "Cannot find module"**
```bash
# Réinstaller les dépendances
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Le frontend ne démarre pas

**Erreur: "Module not found"**
```bash
# Réinstaller les dépendances
cd frontend
rm -rf node_modules .next package-lock.json
npm install
```

**Erreur: "Port 3000 already in use"**
```bash
# Tuer le processus utilisant le port 3000
lsof -ti:3000 | xargs kill -9

# Ou utiliser un autre port
PORT=3001 npm run dev
```

### Erreurs TypeScript

**Backend**
```bash
# Les fichiers de types doivent être référencés avec /// <reference path="..." />
# Vérifier que tsconfig.json inclut "src/types/**/*.d.ts"
```

**Frontend**
```bash
# Vérifier que @/app/types est correctement configuré
# Relancer le serveur Next.js après modifications de types
```

---

## 🔧 Scripts Utiles

### Backend
```bash
# Compilation TypeScript (vérification)
npx tsc --noEmit

# Démarrage avec watch mode
npx nodemon --exec npx ts-node server.ts
```

### Frontend
```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Lint
npm run lint
```

---

## 📚 Documentation Complète

Pour plus de détails, voir:
- [README.md](./README.md) - Documentation complète du projet
- [CLAUDE.md](./CLAUDE.md) - Guide pour Claude Code

---

## ✅ Checklist de Démarrage

- [ ] MongoDB est accessible
- [ ] Fichier `.env` créé dans `backend/`
- [ ] Dépendances backend installées
- [ ] Dépendances frontend installées
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Peut créer un compte
- [ ] Peut se connecter

Si tout est coché, vous êtes prêt! 🎉
