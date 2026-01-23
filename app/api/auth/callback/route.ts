import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/verify-email'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Rediriger vers la page de vérification avec succès
      return NextResponse.redirect(new URL(`${next}?verified=true`, request.url))
    }
  }

  // Rediriger vers la page de vérification en cas d'erreur
  return NextResponse.redirect(new URL('/verify-email', request.url))
}
