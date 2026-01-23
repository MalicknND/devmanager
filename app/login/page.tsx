'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoginForm } from '@/components/forms/login-form'
import { GoogleButton } from '@/components/auth/google-button'
import { toast } from 'sonner'
import type { LoginFormData } from '@/lib/validations'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        // Vérifier si l'erreur est due à un email non vérifié
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          toast.error('Email non vérifié', {
            description: 'Veuillez vérifier votre email avant de vous connecter',
            duration: 5000,
          })
          // Rediriger vers la page de vérification
          localStorage.setItem('pending_verification_email', data.email)
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
          return
        }
        throw error
      }

      // Vérifier si l'utilisateur a vérifié son email
      if (signInData.user && !signInData.user.email_confirmed_at) {
        toast.error('Email non vérifié', {
          description: 'Veuillez vérifier votre email avant de vous connecter',
          duration: 5000,
        })
        localStorage.setItem('pending_verification_email', data.email)
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        return
      }

      toast.success('Connexion réussie')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue'
      toast.error('Erreur de connexion', {
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
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleButton />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>
          <LoginForm onSubmit={handleSubmit} isLoading={loading} />
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <Link href="/register" className="text-primary hover:underline">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
