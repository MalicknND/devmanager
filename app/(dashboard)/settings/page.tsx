'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

function SettingsContent() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez vos préférences et votre compte
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
          <CardDescription>
            Vos informations de profil et de connexion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="mt-1 text-sm">{user?.email}</p>
          </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID Utilisateur</label>
              <p className="mt-1 text-xs font-mono">{user?.id}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsContent
