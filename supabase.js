// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const SUPABASE_URL = 'https://nzytcggkndrdddzfpfyt.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56eXRjZ2drbmRyZGRkemZwZnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODExOTYsImV4cCI6MjA2NTE1NzE5Nn0.7z5JaNdnRYL_XYylbNlFSomdHZTnVlTEoN1_lPhv5sg'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
