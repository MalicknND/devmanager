# DevManager

Application web de gestion de projets et clients pour développeurs freelance.

## 🚀 Stack Technique

- **Next.js 16** + TypeScript
- **Tailwind CSS** + **shadcn/ui** pour le design
- **Supabase** (Auth + PostgreSQL)
- **TanStack React Query** pour le state management serveur
- **Lucide React** pour les icônes

## 🎨 Design System

Thème sombre "Bold & Modern" inspiré de Vercel/GitHub :
- Background principal : `hsl(222, 47%, 6%)`
- Cards avec glassmorphism : `bg-white/5`, `backdrop-blur-xl`, `border-white/10`
- Accent primaire : `hsl(217, 91%, 60%)` - bleu électrique
- Gradients subtils et animations fluides
- Police : Inter

## 📋 Prérequis

- Node.js 18+ 
- Un compte Supabase (gratuit)

## 🛠️ Installation

1. **Cloner le projet et installer les dépendances**

```bash
npm install
```

2. **Configurer Supabase**

- Créez un projet sur [supabase.com](https://supabase.com)
- Suivez les instructions dans `SUPABASE_SETUP.md` pour créer les tables et les politiques RLS
- Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

3. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
devmanager/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Landing page
│   ├── login/             # Page de connexion
│   ├── register/          # Page d'inscription
│   ├── dashboard/         # Tableau de bord
│   ├── clients/           # Gestion des clients
│   ├── projects/          # Gestion des projets
│   └── settings/          # Paramètres
├── components/
│   ├── auth/              # Composants d'authentification
│   ├── layout/            # Layout et navigation
│   └── ui/                # Composants shadcn/ui
├── contexts/              # Contextes React (AuthContext)
├── hooks/                 # Hooks React Query (useClients, useProjects)
├── lib/                   # Utilitaires et configuration Supabase
└── middleware.ts          # Middleware Next.js pour l'auth
```

## ✨ Fonctionnalités

### Authentification
- Inscription/Connexion avec Supabase Auth
- Routes protégées avec middleware
- Gestion de session automatique

### Dashboard
- Statistiques globales (clients, projets actifs, projets terminés, budget total)
- Liste des projets récents

### Clients
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Recherche en temps réel
- Modals pour l'ajout/édition
- Informations : nom, email, téléphone, entreprise, adresse, notes

### Projets
- CRUD complet
- Filtres par statut (en cours, terminé, en pause)
- Liaison avec les clients
- Badges de statut colorés
- Gestion des dates et budgets

## 🔒 Sécurité

- Row Level Security (RLS) activé sur toutes les tables Supabase
- Chaque utilisateur ne peut accéder qu'à ses propres données
- Authentification sécurisée avec Supabase Auth

## 📚 Documentation Supabase

Consultez `SUPABASE_SETUP.md` pour les instructions détaillées de configuration de la base de données.

## 🚢 Déploiement

Le projet peut être déployé sur Vercel :

1. Connectez votre repository GitHub
2. Ajoutez les variables d'environnement Supabase
3. Déployez !

## 📝 License

MIT
