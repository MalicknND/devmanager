"use client";
import { useProjects } from "@/hooks/useProjects";
import { useClients } from "@/hooks/useClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/loading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FolderKanban,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";

function DashboardContent() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: clients } = useClients();

  const totalProjects = projects?.length || 0;
  const activeProjects =
    projects?.filter((p) => p.status === "in_progress").length || 0;
  const completedProjects =
    projects?.filter((p) => p.status === "completed").length || 0;
  const pausedProjects =
    projects?.filter((p) => p.status === "paused").length || 0;
  const totalBudget =
    projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;

  const recentProjects = projects?.slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      in_progress: {
        label: "En cours",
        className: "bg-primary/20 text-primary border-primary/30",
      },
      completed: {
        label: "Terminé",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      paused: {
        label: "En pause",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      },
    };
    const { label, className } = config[status] || config.in_progress;
    return (
      <Badge variant="outline" className={`${className} border font-medium`}>
        {label}
      </Badge>
    );
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="mt-1.5 text-muted-foreground">
          Bon retour ! Voici un aperçu de vos projets et clients.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {projectsLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de projets
                </CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <FolderKanban className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalProjects}</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Projets actifs
                </CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeProjects}</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Terminés
                </CardTitle>
                <div className="rounded-lg bg-green-500/10 p-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedProjects}</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de clients
                </CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{clients?.length || 0}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Projets récents</CardTitle>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
                  >
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Aucun projet pour le moment
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:border-border"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">
                          {project.name}
                        </h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground truncate">
                        {project.clients?.name || "Aucun client"}
                      </p>
                      {project.created_at && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {getTimeAgo(project.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Overview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Vue d'ensemble des projets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Breakdown */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">En cours</span>
                  <span className="font-medium">{activeProjects}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width:
                        totalProjects > 0
                          ? `${(activeProjects / totalProjects) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Terminés</span>
                  <span className="font-medium">{completedProjects}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width:
                        totalProjects > 0
                          ? `${(completedProjects / totalProjects) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">En pause</span>
                  <span className="font-medium">{pausedProjects}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-yellow-500 transition-all"
                    style={{
                      width:
                        totalProjects > 0
                          ? `${(pausedProjects / totalProjects) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Total Budget */}
            <div className="border-t border-border pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Budget total</p>
                <p className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                  }).format(totalBudget)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardContent;
