# Personnalisation des emails Supabase

## 📧 Configuration des templates d'email

Supabase permet de personnaliser les emails envoyés aux utilisateurs lors de l'inscription, de la réinitialisation de mot de passe, etc.

## 🔧 Accéder aux templates

1. Allez sur votre projet Supabase : [supabase.com](https://supabase.com)
2. Accédez à **Authentication** → **Email Templates**
3. Vous verrez plusieurs templates disponibles :
   - **Confirm signup** - Email de confirmation d'inscription
   - **Magic Link** - Lien magique de connexion
   - **Change Email Address** - Changement d'email
   - **Reset Password** - Réinitialisation de mot de passe
   - **Invite user** - Invitation d'utilisateur

## ✏️ Personnaliser le template "Confirm signup"

### Étape 1 : Modifier le sujet

Dans le champ **Subject**, vous pouvez personnaliser le sujet de l'email :

```
Bienvenue sur DevManager - Vérifiez votre email
```

### Étape 2 : Personnaliser le contenu HTML

Vous pouvez utiliser du HTML pour personnaliser complètement l'apparence de l'email. Voici un exemple de template personnalisé :

```html
<h2>Bienvenue sur DevManager ! 🚀</h2>

<p>Bonjour,</p>

<p>Merci de vous être inscrit sur <strong>DevManager</strong>, votre outil de gestion de projets freelance.</p>

<p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>

<p>
  <a href="{{ .ConfirmationURL }}">Vérifier mon email</a>
</p>

<p>Ou copiez-collez ce lien dans votre navigateur :</p>
<p style="word-break: break-all; color: #3b82f6;">{{ .ConfirmationURL }}</p>

<p>Ce lien expirera dans 24 heures.</p>

<p>Si vous n'avez pas créé de compte sur DevManager, vous pouvez ignorer cet email.</p>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">

<p style="color: #6b7280; font-size: 12px;">
  © 2024 DevManager. Tous droits réservés.
</p>
```

### Étape 3 : Variables disponibles

Supabase fournit plusieurs variables que vous pouvez utiliser dans vos templates :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | URL de confirmation (pour Confirm signup) | `https://xxx.supabase.co/auth/v1/verify?token=...` |
| `{{ .Email }}` | Email de l'utilisateur | `user@example.com` |
| `{{ .Token }}` | Token de vérification | `abc123...` |
| `{{ .TokenHash }}` | Hash du token | `xyz789...` |
| `{{ .SiteURL }}` | URL de votre site | `https://votre-site.com` |
| `{{ .RedirectTo }}` | URL de redirection après confirmation | `/dashboard` |

### Étape 4 : Template complet avec design moderne

Voici un template HTML complet avec un design moderne :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification d'email - DevManager</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ⚡ DevManager
              </h1>
              <p style="margin: 8px 0 0; color: #e0e7ff; font-size: 14px;">
                Gestion de projets freelance
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">
                Bienvenue sur DevManager ! 🎉
              </h2>
              
              <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
                Bonjour,
              </p>
              
              <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
                Merci de vous être inscrit sur <strong>DevManager</strong>, votre outil de gestion de projets et clients pour développeurs freelance.
              </p>
              
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                Pour activer votre compte et commencer à gérer vos projets, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 0 0 24px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Vérifier mon email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Ou copiez-collez ce lien dans votre navigateur :
              </p>
              
              <p style="margin: 0 0 24px; padding: 12px; background-color: #f9fafb; border-radius: 4px; word-break: break-all; color: #667eea; font-size: 12px; font-family: monospace;">
                {{ .ConfirmationURL }}
              </p>
              
              <div style="padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 24px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  ⚠️ <strong>Important :</strong> Ce lien expirera dans 24 heures. Si vous n'avez pas créé de compte sur DevManager, vous pouvez ignorer cet email en toute sécurité.
                </p>
              </div>
              
              <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                À bientôt sur DevManager !<br>
                <strong>L'équipe DevManager</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-align: center;">
                © 2024 DevManager. Tous droits réservés.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
                Cet email a été envoyé à {{ .Email }}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## 🎨 Personnalisation avancée

### Ajouter votre logo

Vous pouvez ajouter votre logo en utilisant une URL d'image :

```html
<img src="https://votre-domaine.com/logo.png" alt="DevManager" style="max-width: 200px; height: auto;">
```

### Personnaliser les couleurs

Modifiez les couleurs pour correspondre à votre branding :

```html
<!-- Couleur primaire -->
background-color: #667eea;  /* Votre couleur primaire */

<!-- Couleur de texte -->
color: #111827;  /* Votre couleur de texte principale */
```

### Ajouter des informations personnalisées

Vous pouvez utiliser les metadata utilisateur si vous les avez passées lors de l'inscription :

```html
<p>Bonjour {{ .UserMetadata.full_name }},</p>
```

## 📝 Autres templates à personnaliser

### Reset Password (Réinitialisation de mot de passe)

```html
<h2>Réinitialisation de votre mot de passe</h2>

<p>Vous avez demandé à réinitialiser votre mot de passe sur DevManager.</p>

<p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>

<p>
  <a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a>
</p>

<p>Ce lien expirera dans 1 heure.</p>

<p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
```

### Magic Link (Lien magique)

```html
<h2>Connexion à DevManager</h2>

<p>Cliquez sur le lien ci-dessous pour vous connecter :</p>

<p>
  <a href="{{ .ConfirmationURL }}">Se connecter</a>
</p>

<p>Ce lien expirera dans 1 heure.</p>
```

## ✅ Bonnes pratiques

1. **Tester vos templates** : Envoyez-vous un email de test pour vérifier le rendu
2. **Responsive design** : Assurez-vous que l'email s'affiche bien sur mobile
3. **Accessibilité** : Utilisez des contrastes de couleurs suffisants
4. **Liens de secours** : Incluez toujours le lien en texte brut pour les clients email qui ne supportent pas le HTML
5. **Expiration** : Mentionnez toujours la durée de validité du lien
6. **Support** : Ajoutez un lien vers votre page de contact ou support

## 🔍 Prévisualisation

Après avoir modifié un template :

1. Cliquez sur **Save** pour enregistrer
2. Testez en créant un nouveau compte ou en utilisant la fonction "Resend confirmation email"
3. Vérifiez le rendu sur différents clients email (Gmail, Outlook, Apple Mail, etc.)

## 📚 Ressources

- [Documentation Supabase - Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Guide de design d'emails HTML](https://www.campaignmonitor.com/dev-resources/guides/coding/)

## 🎯 Exemple de template minimaliste

Si vous préférez un design plus simple :

```html
<h2>Bienvenue sur DevManager</h2>

<p>Cliquez sur ce lien pour vérifier votre email :</p>

<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<p>Merci,<br>L'équipe DevManager</p>
```

---

**Note :** Les modifications des templates sont immédiates. Tous les nouveaux emails utiliseront le template personnalisé.
