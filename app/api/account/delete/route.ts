import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    // Vérifier l'authentification de l'utilisateur
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Utiliser le client Admin pour supprimer l'utilisateur
    // Le client Admin a les permissions nécessaires pour supprimer des utilisateurs
    const adminClient = createAdminClient()
    const { error } = await adminClient.auth.admin.deleteUser(user.id)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la suppression du compte' },
        { status: 500 }
      )
    }

    // La suppression en cascade dans Supabase supprimera automatiquement :
    // - Le profil (via ON DELETE CASCADE)
    // - Les clients (via ON DELETE CASCADE)
    // - Les projets (via ON DELETE CASCADE)
    // - Les rôles utilisateur (via ON DELETE CASCADE)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur inattendue est survenue' },
      { status: 500 }
    )
  }
}
