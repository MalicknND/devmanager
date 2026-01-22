import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export function useClients() {
  const supabase = createClient()
  const { user } = useAuth()

  return useQuery({
    queryKey: ['clients', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Client[]
    },
    enabled: !!user,
  })
}

export function useCreateClient() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('clients')
        .insert({ ...client, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data as Client
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] })
    },
  })
}

export function useUpdateClient() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as Client
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] })
    },
  })
}

export function useDeleteClient() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] })
    },
  })
}
