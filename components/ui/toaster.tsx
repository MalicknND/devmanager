'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'glass-card border border-border',
          title: 'text-foreground',
          description: 'text-muted-foreground',
          error: 'border-destructive',
          success: 'border-green-500',
          warning: 'border-yellow-500',
          info: 'border-primary',
        },
      }}
    />
  )
}
