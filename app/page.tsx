import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, FolderKanban, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DevManager
              </span>
              <br />
              <span className="text-foreground">Gérez vos projets freelance</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              L'outil tout-en-un pour gérer vos clients, projets et budgets.
              Simple, moderne et puissant.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/register">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Gradient decoration */}
        <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une solution complète pour gérer votre activité freelance
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="glass-card rounded-xl p-6 transition-all hover:scale-105"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt à démarrer ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Rejoignez les développeurs freelance qui font confiance à DevManager
            </p>
            <Button asChild size="lg" className="mt-8 text-base">
              <Link href="/register">
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    name: 'Gestion de clients',
    description: 'Centralisez toutes les informations de vos clients en un seul endroit.',
    icon: Users,
  },
  {
    name: 'Suivi de projets',
    description: 'Suivez l\'avancement de vos projets avec des statuts clairs et des deadlines.',
    icon: FolderKanban,
  },
  {
    name: 'Gestion budgétaire',
    description: 'Tenez compte de vos budgets et revenus pour chaque projet.',
    icon: TrendingUp,
  },
]
