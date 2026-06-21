import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pkjlrrpyvtygegzfetbx.supabase.co'
const supabaseKey = 'sb_publishable_z4Buhi8_yHI4KsWTY1bk3Q_ueWz9HxU'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)