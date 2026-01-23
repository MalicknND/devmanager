'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, User } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>
  onSubmit: (data: ProfileFormData) => Promise<void>
  isLoading?: boolean
}

export function ProfileForm({ defaultValues, onSubmit, isLoading }: ProfileFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    defaultValues?.avatar_url || null
  )

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues || {
      full_name: '',
      avatar_url: '',
    },
  })

  const handleAvatarUrlChange = (url: string) => {
    form.setValue('avatar_url', url)
    setAvatarPreview(url || null)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarPreview ? (
              <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  onError={() => setAvatarPreview(null)}
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-primary/10">
                <User className="h-10 w-10 text-primary" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'avatar</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleAvatarUrlChange(e.target.value)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Entrez l'URL d'une image pour votre avatar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Jean Dupont" {...field} />
              </FormControl>
              <FormDescription>Votre nom complet affiché sur votre profil</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Form>
  )
}
