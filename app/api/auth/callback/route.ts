import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Vérifier si l'utilisateur vient de OAuth (Google)
      const user = data.user
      
      // Si l'utilisateur vient de OAuth, créer/mettre à jour le profil
      if (user && user.app_metadata?.provider === 'google') {
        // Le trigger Supabase créera automatiquement le profil
        // Mais on peut aussi vérifier et mettre à jour si nécessaire
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (!profile && user.user_metadata) {
          // Créer le profil si il n'existe pas
          await supabase.from('profiles').insert({
            user_id: user.id,
            full_name: user.user_metadata.full_name || user.user_metadata.name,
            email: user.email,
            avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
          })
        }
      }

      // Rediriger vers la destination appropriée
      if (next === '/verify-email') {
        return NextResponse.redirect(new URL(`${next}?verified=true`, request.url))
      }
      
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Rediriger vers la page de connexion en cas d'erreur
  return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
}
