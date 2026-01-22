import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export type ProjectStatus = 'in_progress' | 'completed' | 'paused'

export interface Project {
  id: string
  user_id: string
  client_id: string
  name: string
  description: string | null
  status: ProjectStatus
  start_date: string | null
  end_date: string | null
  budget: number | null
  created_at: string
  updated_at: string
  clients?: {
    name: string
  }
}

export function useProjects(status?: ProjectStatus) {
  const supabase = createClient()
  const { user } = useAuth()

  return useQuery({
    queryKey: ['projects', user?.id, status],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated')
      let query = supabase
        .from('projects')
        .select('*, clients(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Project[]
    },
    enabled: !!user,
  })
}

export function useCreateProject() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'clients'>
    ) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...project, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onMutate: async (newProject) => {
      if (!user) return

      await queryClient.cancelQueries({ queryKey: ['projects', user.id] })

      const previousProjects = queryClient.getQueryData<Project[]>(['projects', user.id])

      const optimisticProject: Project = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        ...newProject,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      queryClient.setQueryData<Project[]>(['projects', user.id], (old = []) => [
        optimisticProject,
        ...old,
      ])

      return { previousProjects }
    },
    onError: (error, _newProject, context) => {
      if (context?.previousProjects && user) {
        queryClient.setQueryData(['projects', user.id], context.previousProjects)
      }
      toast.error('Erreur lors de la création du projet', {
        description: error.message,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] })
      toast.success('Projet créé avec succès')
    },
  })
}

export function useUpdateProject() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onMutate: async ({ id, ...updates }) => {
      if (!user) return

      await queryClient.cancelQueries({ queryKey: ['projects', user.id] })

      const previousProjects = queryClient.getQueryData<Project[]>(['projects', user.id])

      queryClient.setQueryData<Project[]>(['projects', user.id], (old = []) =>
        old.map((project) =>
          project.id === id
            ? { ...project, ...updates, updated_at: new Date().toISOString() }
            : project
        )
      )

      return { previousProjects }
    },
    onError: (error, _variables, context) => {
      if (context?.previousProjects && user) {
        queryClient.setQueryData(['projects', user.id], context.previousProjects)
      }
      toast.error('Erreur lors de la modification du projet', {
        description: error.message,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] })
      toast.success('Projet modifié avec succès')
    },
  })
}

export function useDeleteProject() {
  const supabase = createClient()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onMutate: async (id) => {
      if (!user) return

      await queryClient.cancelQueries({ queryKey: ['projects', user.id] })

      const previousProjects = queryClient.getQueryData<Project[]>(['projects', user.id])

      queryClient.setQueryData<Project[]>(['projects', user.id], (old = []) =>
        old.filter((project) => project.id !== id)
      )

      return { previousProjects }
    },
    onError: (error, _id, context) => {
      if (context?.previousProjects && user) {
        queryClient.setQueryData(['projects', user.id], context.previousProjects)
      }
      toast.error('Erreur lors de la suppression du projet', {
        description: error.message,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] })
      toast.success('Projet supprimé avec succès')
    },
  })
}
