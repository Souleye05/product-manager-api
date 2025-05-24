# Backend API avec système d'authentification

Ce projet est une API backend complète avec un système d'authentification, construite avec Node.js, Express, TypeScript et Prisma ORM. Cette API fournit des fonctionnalités d'inscription, de connexion et de gestion des utilisateurs avec JWT pour l'authentification.

## Table des matières

- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Système d'authentification](#système-dauthentification)
- [Modèles de données](#modèles-de-données)
- [Structure du code](#structure-du-code)

## Architecture du projet

Le projet suit une architecture en couches avec séparation des responsabilités :

```
backend/
├── prisma/
│   ├── schema.prisma     # Schéma de la base de données
│   ├── migrations/       # Migrations de la base de données
│   └── seed.ts           # Script pour peupler la base de données
├── src/
│   ├── api/              # Couche API (routes, contrôleurs, middlewares)
│   │   ├── controllers/  # Logique de traitement des requêtes
│   │   ├── middlewares/  # Middlewares (auth, erreurs)
│   │   └── routes/       # Définition des routes
│   ├── config/           # Configuration du serveur et des services
│   ├── core/             # Cœur de l'application
│   │   ├── dtos/         # Objets de transfert de données
│   │   └── interfaces/   # Interfaces et types
│   ├── services/         # Logique métier et services
│   ├── utils/            # Utilitaires et helpers
│   └── app.ts            # Point d'entrée de l'application
├── package.json
├── tsconfig.json
└── .env                  # Variables d'environnement
```

## Prérequis

- Node.js v16 ou supérieur
- npm ou yarn
- PostgreSQL (ou un autre système de base de données supporté par Prisma)

## Installation

1. **Cloner le dépôt**

```bash
git clone <https://github.com/Souleye05/product-manager-api>
cd backend
```

2. **Installer les dépendances**

```bash
npm install

3. **Configurer les variables d'environnement**

Copiez le fichier d'exemple `.env.example` et créez votre propre fichier `.env` :

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos propres valeurs.

4. **Initialiser la base de données**

```bash
# Créer les migrations initiales
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

5. **Compiler le projet TypeScript**

```bash
npm run build


6. **Lancer l'application**

Pour le développement :

```bash
npm run dev


Pour la production :

```bash
npm start


## Configuration

### Variables d'environnement

Le fichier `.env` doit contenir les variables suivantes :

```
# Environnement (development, production)
NODE_ENV=development

# Port du serveur
PORT=3000

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRES_IN=24h

# Variables optionnelles
LOG_LEVEL=debug
```

## Utilisation

Une fois l'application démarrée, l'API est accessible à l'adresse suivante :

```
http://localhost:3000/api
```

## API Endpoints

### Authentification

| Méthode | Endpoint              | Description                                 | Corps de la requête                                     | Authentification requise |
|---------|----------------------|---------------------------------------------|--------------------------------------------------------|--------------------------|
| POST    | /api/auth/register   | Inscription d'un nouvel utilisateur          | `{ "username": "...", "email": "...", "password": "..." }` | Non                      |
| POST    | /api/auth/login      | Connexion d'un utilisateur                  | `{ "email": "...", "password": "..." }`                   | Non                      |
| GET     | /api/auth/me         | Récupération du profil de l'utilisateur      | -                                                        | Oui                      |

### Produits (exemple)

| Méthode | Endpoint              | Description                                 | Corps de la requête                                 | Authentification requise |
|---------|----------------------|---------------------------------------------|--------------------------------------------------|--------------------------|
| GET     | /api/products        | Liste tous les produits                     | -                                                  | Non                      |
| GET     | /api/products/:id    | Récupère un produit spécifique              | -                                                  | Non                      |
| POST    | /api/products        | Crée un nouveau produit                     | `{ "name": "...", "price": ..., "description": "..." }` | Oui (Admin)              |
| PUT     | /api/products/:id    | Met à jour un produit                       | `{ "name": "...", "price": ..., "description": "..." }` | Oui (Admin)              |
| DELETE  | /api/products/:id    | Supprime un produit                         | -                                                  | Oui (Admin)              |

## Système d'authentification

### Fonctionnement

Le système d'authentification utilise JSON Web Tokens (JWT) pour gérer les sessions utilisateurs :

1. **Inscription** : L'utilisateur s'inscrit avec un nom d'utilisateur, un email et un mot de passe. Le mot de passe est haché avant d'être stocké dans la base de données.

2. **Connexion** : L'utilisateur se connecte avec son email et son mot de passe. Si les identifiants sont valides, un token JWT est généré et renvoyé.

3. **Authentification** : Pour les routes protégées, le token JWT doit être inclus dans l'en-tête `Authorization` de la requête sous la forme `Bearer <token>`. Le middleware d'authentification vérifie la validité du token et extrait les informations de l'utilisateur.

4. **Autorisation** : Certaines routes nécessitent des droits spécifiques (par exemple, administrateur). Le middleware d'autorisation vérifie si l'utilisateur dispose des droits requis.

### Middleware d'authentification

Le middleware d'authentification (`authMiddleware.ts`) effectue les tâches suivantes :

- Extrait le token JWT de l'en-tête `Authorization`
- Vérifie la validité du token
- Récupère les informations de l'utilisateur à partir du token
- Ajoute l'utilisateur à l'objet `request` pour les routes suivantes

### Sécurité

- Les mots de passe sont hachés avec bcrypt avant d'être stockés
- Les tokens JWT expirent après une durée configurable (par défaut : 24 heures)
- Le secret JWT est stocké dans les variables d'environnement (ne jamais le commettre dans le code source)

## Modèles de données

### Utilisateur (User)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Produit (Product)

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  imageUrl    String?
  category    String?
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Structure du code

Le projet utilise une architecture en couches pour séparer les responsabilités :

### 1. Couche API (`/api`)

- **Contrôleurs** : Gèrent les requêtes HTTP et délèguent le traitement aux services
- **Middlewares** : Fonctions intermédiaires pour l'authentification, la gestion des erreurs, etc.
- **Routes** : Définissent les points d'entrée de l'API

### 2. Couche Services (`/services`)

- Contient la logique métier
- Communique avec la base de données via Prisma
- Implémente les interfaces définies dans la couche Core

### 3. Couche Core (`/core`)

- **DTOs** : Objets de transfert de données pour standardiser les entrées/sorties
- **Interfaces** : Définissent les contrats pour les services et autres composants

### 4. Utilitaires (`/utils`)

- Fonctions auxiliaires pour le hachage des mots de passe, la journalisation, etc.

## Bonnes pratiques implémentées

- **Journalisation** : Utilisation de Winston pour une journalisation structurée
- **Gestion des erreurs** : Middleware centralisé pour la gestion des erreurs
- **Validation** : Validation des entrées utilisateur
- **Sécurité** : Hachage des mots de passe, utilisation de JWT pour l'authentification
- **Architecture** : Séparation des responsabilités, injection de dépendances

---

## Commandes utiles

```bash
# Lancer le serveur en mode développement
npm run dev

# Compiler le projet TypeScript
npm run build

# Lancer le serveur en mode production
npm start

# Générer le client Prisma
npm run prisma:generate

# Créer une migration de base de données
npm run prisma:migrate

# Lancer Prisma Studio (interface visuelle pour la base de données)
npm run prisma:studio
```

## Licence

[MIT](LICENSE)