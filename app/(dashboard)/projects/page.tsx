'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  type Project,
  type ProjectStatus,
} from '@/hooks/useProjects'
import { useClients } from '@/hooks/useClients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProjectForm } from '@/components/forms/project-form'
import { usePagination } from '@/hooks/usePagination'
import { Pagination } from '@/components/ui/pagination'
import type { ProjectFormData } from '@/lib/validations'
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
import { TableSkeleton } from '@/components/ui/loading'
import { Plus, Search, Edit, Trash2, Filter, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

function ProjectsContent() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const { data: projects, isLoading } = useProjects(
    statusFilter === 'all' ? undefined : statusFilter
  )
  const { data: clients } = useClients()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const filteredProjects = useMemo(
    () =>
      projects?.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.clients?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [],
    [projects, searchQuery]
  )

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    reset: resetPagination,
  } = usePagination(filteredProjects, 12)

  useEffect(() => {
    resetPagination()
  }, [searchQuery, statusFilter, resetPagination])

  const getStatusBadge = (status: ProjectStatus) => {
    const variants: Record<ProjectStatus, 'default' | 'secondary' | 'destructive'> = {
      in_progress: 'default',
      completed: 'secondary',
      paused: 'destructive',
    }
    const labels: Record<ProjectStatus, string> = {
      in_progress: 'En cours',
      completed: 'Terminé',
      paused: 'En pause',
    }
    return (
      <Badge variant={variants[status]}>{labels[status]}</Badge>
    )
  }

  const handleOpenDialog = (project?: Project) => {
    setEditingProject(project || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
  }

  const handleSubmit = async (data: ProjectFormData) => {
    const projectData = {
      name: data.name,
      description: data.description || null,
      status: data.status,
      client_id: data.client_id,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      budget: data.budget ? parseFloat(data.budget) : null,
    }

    if (editingProject) {
      await updateProject.mutateAsync({
        id: editingProject.id,
        ...projectData,
      })
    } else {
      await createProject.mutateAsync(projectData)
    }
    handleCloseDialog()
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id)
    } catch (error) {
      // Error is handled by the hook's onError
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projets</h1>
            <p className="mt-2 text-muted-foreground">
              Gérez vos projets et leur avancement
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject
                    ? 'Modifiez les informations du projet'
                    : 'Créez un nouveau projet'}
                </DialogDescription>
              </DialogHeader>
              {clients && (
                <ProjectForm
                  defaultValues={
                    editingProject
                      ? {
                          name: editingProject.name,
                          description: editingProject.description || '',
                          status: editingProject.status,
                          client_id: editingProject.client_id,
                          start_date: editingProject.start_date
                            ? format(new Date(editingProject.start_date), 'yyyy-MM-dd')
                            : '',
                          end_date: editingProject.end_date
                            ? format(new Date(editingProject.end_date), 'yyyy-MM-dd')
                            : '',
                          budget: editingProject.budget?.toString() || '',
                        }
                      : undefined
                  }
                  clients={clients}
                  onSubmit={handleSubmit}
                  onCancel={handleCloseDialog}
                  isLoading={createProject.isPending || updateProject.isPending}
                />
              )}
            </DialogContent>
          </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ProjectStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="paused">En pause</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {/* Projects Grid */}
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : filteredProjects.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Aucun projet ne correspond à vos critères'
                  : 'Aucun projet pour le moment'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((project) => (
              <Card key={project.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {project.clients?.name}
                      </p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    {project.start_date && (
                      <span className="text-muted-foreground">
                        Début:{' '}
                        {format(new Date(project.start_date), 'dd MMM yyyy', {
                          locale: fr,
                        })}
                      </span>
                    )}
                    {project.budget && (
                      <span className="font-semibold">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(project.budget)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(project)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteProject.isPending}
                        >
                          {deleteProject.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le projet</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est
                            irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(project.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  onPrevious={previousPage}
                  onNext={nextPage}
                  hasPrevious={hasPreviousPage}
                  hasNext={hasNextPage}
                />
              </div>
            )}
          </>
        )}
    </div>
  )
}

export default ProjectsContent
