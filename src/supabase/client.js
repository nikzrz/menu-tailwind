import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtanxmmxenynsounkcji.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10YW54bW14ZW55bnNvdW5rY2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTUwNDMsImV4cCI6MjA2MzU5MTA0M30.kKyLbKI8flrvVCy3W-4dA5MjYF77_3dvSGeFFDF1ifU'

export const supabase = createClient(supabaseUrl, supabaseKey)
