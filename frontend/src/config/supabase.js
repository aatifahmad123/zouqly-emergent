import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://pmgxaqpxlahnqwxrweyn.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'sb_publishable_KZOAFH_vABRgia_v2OBeWQ_uYurB14k'

export const supabase = createClient(supabaseUrl, supabaseKey)