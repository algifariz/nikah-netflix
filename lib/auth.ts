import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Check if the current request is authenticated via Supabase Auth.
 * Returns the user if authenticated, null otherwise.
 * Use this in API routes as a replacement for getServerSession.
 */
export async function getAuthUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
