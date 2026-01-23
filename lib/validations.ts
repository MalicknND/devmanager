import { z } from 'zod'

// Validation pour les clients
export const clientSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().max(20, 'Numéro de téléphone trop long').optional().or(z.literal('')),
  company: z.string().max(100, 'Nom d\'entreprise trop long').optional().or(z.literal('')),
  address: z.string().max(500, 'Adresse trop longue').optional().or(z.literal('')),
  notes: z.string().max(1000, 'Notes trop longues').optional().or(z.literal('')),
})

export type ClientFormData = z.infer<typeof clientSchema>

// Validation pour les projets
export const projectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis').max(100, 'Le nom est trop long'),
  description: z.string().max(1000, 'Description trop longue').optional().or(z.literal('')),
  status: z.enum(['in_progress', 'completed', 'paused'], {
    required_error: 'Le statut est requis',
  }),
  client_id: z.string().min(1, 'Un client doit être sélectionné'),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  budget: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true
        const num = parseFloat(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Le budget doit être un nombre positif' }
    ),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Validation pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Validation pour le profil
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  avatar_url: z.string().url('URL invalide').optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
