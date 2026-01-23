# Configuration Google OAuth avec Supabase

## ✅ Fonctionnalités implémentées

La connexion avec Google est maintenant disponible sur les pages de connexion et d'inscription :

1. **Bouton Google OAuth** : Composant réutilisable avec design moderne
2. **Intégration** : Ajouté sur les pages `/login` et `/register`
3. **Callback OAuth** : Route API mise à jour pour gérer la connexion Google
4. **Création automatique de profil** : Le profil est créé automatiquement lors de la première connexion Google

## Configuration Google Cloud Console

### Étape 1 : Créer un projet OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'**API Google+** pour votre projet :
   - Allez dans **APIs & Services** → **Library**
   - Recherchez "Google+ API" et activez-la

### Étape 2 : Créer les identifiants OAuth

1. Allez dans **APIs & Services** → **Credentials**
2. Cliquez sur **Create Credentials** → **OAuth client ID**
3. Si c'est la première fois, configurez l'écran de consentement OAuth :
   - **User Type** : External (pour la plupart des cas)
   - Remplissez les informations requises
   - Ajoutez votre email comme test user si nécessaire
4. Créez l'OAuth client ID :
   - **Application type** : Web application
   - **Name** : DevManager (ou le nom de votre choix)
   - **Authorized JavaScript origins** :
     ```
     http://localhost:3000
     https://votre-domaine.com
     ```
   - **Authorized redirect URIs** :
     ```
     https://[VOTRE_PROJECT_ID].supabase.co/auth/v1/callback
     ```
     > Remplacez `[VOTRE_PROJECT_ID]` par l'ID de votre projet Supabase (visible dans l'URL de votre projet)

5. **Copiez le Client ID et le Client Secret**

### Étape 3 : Configurer dans Supabase

1. Allez sur votre projet Supabase : [supabase.com](https://supabase.com)
2. Accédez à **Authentication** → **Providers**
3. Trouvez **Google** dans la liste
4. Activez le provider Google
5. Entrez vos identifiants :
   - **Client ID (for OAuth)** : Collez le Client ID de Google
   - **Client Secret (for OAuth)** : Collez le Client Secret de Google
6. Cliquez sur **Save**

### Étape 4 : Configurer les URLs de redirection dans Supabase

Dans **Authentication** → **URL Configuration** :

- **Site URL** : `http://localhost:3000` (développement) ou votre URL de production
- **Redirect URLs** : Assurez-vous d'avoir :
  ```
  http://localhost:3000/api/auth/callback
  https://votre-domaine.com/api/auth/callback
  ```

## Flux utilisateur

### Connexion avec Google

1. L'utilisateur clique sur "Continuer avec Google"
2. Redirection vers la page de connexion Google
3. L'utilisateur sélectionne son compte Google
4. Redirection vers `/api/auth/callback`
5. La route API :
   - Échange le code pour une session
   - Crée/met à jour le profil automatiquement
   - Redirige vers le dashboard

### Inscription avec Google

Le processus est identique à la connexion. Si c'est la première fois que l'utilisateur se connecte avec Google :
- Un compte est créé automatiquement
- Le profil est créé avec les informations Google (nom, email, avatar)
- L'utilisateur est directement connecté (pas besoin de vérification d'email)

## Fichiers créés/modifiés

- ✅ `components/auth/google-button.tsx` - Composant bouton Google OAuth
- ✅ `app/login/page.tsx` - Ajout du bouton Google
- ✅ `app/register/page.tsx` - Ajout du bouton Google
- ✅ `app/api/auth/callback/route.ts` - Gestion du callback OAuth et création de profil

## Test

1. Assurez-vous que Google OAuth est configuré dans Supabase
2. Allez sur `/login` ou `/register`
3. Cliquez sur "Continuer avec Google"
4. Sélectionnez un compte Google
5. Vérifiez que vous êtes redirigé vers le dashboard
6. Vérifiez que votre profil est créé avec les informations Google

## Personnalisation

### Modifier le design du bouton

Éditez `components/auth/google-button.tsx` pour personnaliser :
- Le style du bouton
- L'icône Google
- Le texte affiché

### Ajouter d'autres providers OAuth

Pour ajouter GitHub, Facebook, etc. :

1. Configurez le provider dans Supabase (comme pour Google)
2. Créez un composant similaire à `GoogleButton`
3. Ajoutez-le aux pages de connexion/inscription

Exemple pour GitHub :

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
  },
})
```

## Dépannage

### Erreur : "redirect_uri_mismatch"

- Vérifiez que l'URL de redirection dans Google Cloud Console correspond exactement à celle de Supabase
- Format attendu : `https://[PROJECT_ID].supabase.co/auth/v1/callback`

### Erreur : "invalid_client"

- Vérifiez que le Client ID et Client Secret sont corrects dans Supabase
- Assurez-vous que l'API Google+ est activée dans Google Cloud Console

### L'utilisateur n'est pas redirigé correctement

- Vérifiez les Redirect URLs dans Supabase
- Vérifiez que la route `/api/auth/callback` fonctionne correctement

### Le profil n'est pas créé

- Vérifiez que le trigger `handle_new_user` est bien configuré dans Supabase
- Vérifiez les logs Supabase pour voir les erreurs éventuelles
