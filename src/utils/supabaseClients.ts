import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

const supabaseClient = {
  supabase: createClient(supabaseUrl, supabaseAnonKey),
};

export const { supabase } = supabaseClient;
