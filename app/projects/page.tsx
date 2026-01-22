'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
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
import { Label } from '@/components/ui/label'
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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react'
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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'in_progress' as ProjectStatus,
    client_id: '',
    start_date: '',
    end_date: '',
    budget: '',
  })

  const filteredProjects =
    projects?.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clients?.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

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
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        client_id: project.client_id,
        start_date: project.start_date
          ? format(new Date(project.start_date), 'yyyy-MM-dd')
          : '',
        end_date: project.end_date
          ? format(new Date(project.end_date), 'yyyy-MM-dd')
          : '',
        budget: project.budget?.toString() || '',
      })
    } else {
      setEditingProject(null)
      setFormData({
        name: '',
        description: '',
        status: 'in_progress',
        client_id: '',
        start_date: '',
        end_date: '',
        budget: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    setFormData({
      name: '',
      description: '',
      status: 'in_progress',
      client_id: '',
      start_date: '',
      end_date: '',
      budget: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const projectData = {
        name: formData.name,
        description: formData.description || null,
        status: formData.status,
        client_id: formData.client_id,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
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
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await deleteProject.mutateAsync(id)
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  return (
    <AppLayout>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du projet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client *</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, client_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: ProjectStatus) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="paused">En pause</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (€)</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Date de début</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Date de fin</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProject.isPending || updateProject.isPending}
                  >
                    {editingProject ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </form>
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
          <div className="py-12 text-center text-muted-foreground">Chargement...</div>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  )
}
