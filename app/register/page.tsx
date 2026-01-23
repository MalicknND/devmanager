'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/forms/register-form'
import { toast } from 'sonner'
import type { RegisterFormData } from '@/lib/validations'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (data: RegisterFormData) => {
    setLoading(true)

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/verify-email`,
          data: {
            full_name: data.fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      // Stocker l'email pour la page de vérification
      if (signUpData.user) {
        localStorage.setItem('pending_verification_email', data.email)
      }

      // Vérifier si l'email nécessite une confirmation
      // Par défaut, Supabase envoie un email de vérification
      // Si l'utilisateur n'a pas de session, c'est qu'il doit vérifier son email
      if (signUpData.user && !signUpData.session) {
        toast.success('Compte créé ! Vérifiez votre email', {
          description: 'Un email de vérification a été envoyé à votre adresse',
          duration: 5000,
        })
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else {
        // Si une session est créée (email confirmé automatiquement ou désactivé)
        toast.success('Compte créé avec succès')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue'
      toast.error('Erreur lors de l\'inscription', {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
            Inscrivez-vous pour commencer à gérer vos projets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm onSubmit={handleSubmit} isLoading={loading} />
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Déjà un compte ? </span>
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
