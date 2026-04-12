import { createClient } from "@supabase/supabase-js";

// Use environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nzknubmeznjlupcvvzag.supabase.co";
const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_n3bCxheZ5iOeE_RoBwz7MQ_MLqJFfW0";

// Export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
