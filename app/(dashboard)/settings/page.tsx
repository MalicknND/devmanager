'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile, useUpdateProfile, useDeleteAccount } from '@/hooks/useProfile'
import { ProfileForm } from '@/components/forms/profile-form'
import { User, Mail, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import type { ProfileFormData } from '@/lib/validations'

function SettingsContent() {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const deleteAccount = useDeleteAccount()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleUpdateProfile = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync({
      full_name: data.full_name,
      avatar_url: data.avatar_url || null,
    })
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync()
    } catch (error: any) {
      // Gestion d'erreur déjà dans le hook
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez vos préférences et votre compte
        </p>
      </div>

      {/* Profile Section */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Modifiez vos informations personnelles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ProfileForm
              defaultValues={{
                full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                avatar_url: profile?.avatar_url || '',
              }}
              onSubmit={handleUpdateProfile}
              isLoading={updateProfile.isPending}
            />
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>
                Vos informations de connexion et d'identification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{user?.email}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              L'email ne peut pas être modifié depuis cette interface
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">ID Utilisateur</label>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
              <p className="text-xs font-mono text-muted-foreground">{user?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass-card border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive">Supprimer le compte</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Une fois votre compte supprimé, toutes vos données seront définitivement
                    perdues. Cette action est irréversible.
                  </p>
                </div>
              </div>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    disabled={deleteAccount.isPending}
                  >
                    {deleteAccount.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer mon compte
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Supprimer définitivement votre compte
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 pt-2">
                      <p>
                        Cette action est <strong>irréversible</strong>. Toutes vos données seront
                        définitivement supprimées :
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        <li>Votre profil</li>
                        <li>Tous vos clients</li>
                        <li>Tous vos projets</li>
                        <li>Toutes vos données associées</li>
                      </ul>
                      <p className="pt-2 font-semibold">
                        Êtes-vous absolument sûr de vouloir continuer ?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteAccount.isPending}
                    >
                      {deleteAccount.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        'Oui, supprimer mon compte'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsContent
