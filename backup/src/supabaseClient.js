import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase URL and Public Key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://nzknubmeznjlupcvvzag.supabase.co";
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_n3bCxheZ5iOeE_RoBwz7MQ_MLqJFfW0";

// Export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
