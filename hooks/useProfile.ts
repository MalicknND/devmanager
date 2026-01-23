import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export interface Profile {
  user_id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function useProfile() {
  const supabase = createClient()
  const { user } = useAuth()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!user,
  })
}

export function useUpdateProfile() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: { full_name?: string; avatar_url?: string }) => {
      if (!user) throw new Error('Not authenticated')
      
      // Mettre à jour le profil
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      // Mettre à jour les metadata utilisateur si le nom change
      if (updates.full_name) {
        const { error: userError } = await supabase.auth.updateUser({
          data: { full_name: updates.full_name },
        })
        if (userError) throw userError
      }

      return data as Profile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      toast.success('Profil mis à jour avec succès')
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la mise à jour du profil', {
        description: error.message,
      })
    },
  })
}

export function useDeleteAccount() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      
      // Appeler la route API Next.js pour supprimer le compte
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la suppression du compte')
      }
    },
    onSuccess: async () => {
      queryClient.clear()
      await supabase.auth.signOut()
      toast.success('Compte supprimé avec succès')
      window.location.href = '/'
    },
    onError: (error: Error) => {
      toast.error('Erreur lors de la suppression du compte', {
        description: error.message,
      })
    },
  })
}
