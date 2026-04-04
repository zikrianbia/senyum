import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aguawtckhuzlpmumakfo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndWF3dGNraHV6bHBtdW1ha2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDAwODAsImV4cCI6MjA5MDg3NjA4MH0.OdKKxdzRTC0W1-i3iE6KSrJD_7gbin-FW2A2m5D_eUk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
