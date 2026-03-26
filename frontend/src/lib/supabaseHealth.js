import { isSupabaseConfigured, supabase } from './supabaseClient'

export async function checkSupabaseHealth() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      message:
        'Thieu VITE_SUPABASE_URL hoac VITE_SUPABASE_ANON_KEY trong file .env.',
    }
  }

  const healthTable = import.meta.env.VITE_SUPABASE_HEALTH_TABLE

  if (healthTable) {
    const { error } = await supabase
      .from(healthTable)
      .select('*', { count: 'exact', head: true })
      .limit(1)

    if (!error) {
      return {
        ok: true,
        message: `Ket noi DB OK (ping qua bang ${healthTable}).`,
      }
    }

    return {
      ok: false,
      message: `Ping DB that bai (${error.message}).`,
    }
  }

  const { error } = await supabase.auth.getSession()

  if (error) {
    return {
      ok: false,
      message: `Supabase API khong phan hoi (${error.message}).`,
    }
  }

  return {
    ok: true,
    message:
      'Supabase API dang hoat dong. Dat VITE_SUPABASE_HEALTH_TABLE de ping truc tiep DB.',
  }
}
