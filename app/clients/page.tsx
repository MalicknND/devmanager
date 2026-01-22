'use client'

import { useState, useMemo, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  type Client,
} from '@/hooks/useClients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientForm } from '@/components/forms/client-form'
import { usePagination } from '@/hooks/usePagination'
import { Pagination } from '@/components/ui/pagination'
import type { ClientFormData } from '@/lib/validations'
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
import { TableSkeleton, LoadingSpinner } from '@/components/ui/loading'
import { Plus, Search, Edit, Trash2, Mail, Phone, Building, Loader2 } from 'lucide-react'

function ClientsContent() {
  const { data: clients, isLoading } = useClients()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const filteredClients = useMemo(
    () =>
      clients?.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.company?.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [],
    [clients, searchQuery]
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
  } = usePagination(filteredClients, 12)

  // Reset pagination when search changes
  useEffect(() => {
    resetPagination()
  }, [searchQuery, resetPagination])

  const handleOpenDialog = (client?: Client) => {
    setEditingClient(client || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingClient(null)
  }

  const handleSubmit = async (data: ClientFormData) => {
    if (editingClient) {
      await updateClient.mutateAsync({
        id: editingClient.id,
        ...data,
      })
    } else {
      await createClient.mutateAsync(data)
    }
    handleCloseDialog()
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteClient.mutateAsync(id)
    } catch (error) {
      // Error is handled by the hook's onError
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="mt-2 text-muted-foreground">
              Gérez vos clients et leurs informations
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un client
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Modifier le client' : 'Nouveau client'}
                </DialogTitle>
                <DialogDescription>
                  {editingClient
                    ? 'Modifiez les informations du client'
                    : 'Ajoutez un nouveau client à votre liste'}
                </DialogDescription>
              </DialogHeader>
              <ClientForm
                defaultValues={
                  editingClient
                    ? {
                        name: editingClient.name,
                        email: editingClient.email || '',
                        phone: editingClient.phone || '',
                        company: editingClient.company || '',
                        address: editingClient.address || '',
                        notes: editingClient.notes || '',
                      }
                    : undefined
                }
                onSubmit={handleSubmit}
                onCancel={handleCloseDialog}
                isLoading={createClient.isPending || updateClient.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Clients Grid */}
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : filteredClients.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Aucun client ne correspond à votre recherche'
                  : 'Aucun client pour le moment'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((client) => (
              <Card key={client.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={deleteClient.isPending}>
                            {deleteClient.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
                              irréversible et supprimera également tous les projets associés.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(client.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </div>
                  )}
                  {client.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {client.company}
                    </div>
                  )}
                  {client.notes && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {client.notes}
                    </p>
                  )}
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
    </AppLayout>
  )
}

export default function ClientsPage() {
  return (
    <ProtectedRoute>
      <ClientsContent />
    </ProtectedRoute>
  )
}
