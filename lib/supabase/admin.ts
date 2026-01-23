import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Client Supabase Admin avec service_role key
 * ⚠️ À utiliser UNIQUEMENT côté serveur (routes API, Server Components)
 * ⚠️ Ne JAMAIS exposer cette clé côté client
 */
export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations. Add it to your .env.local file.'
    )
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
