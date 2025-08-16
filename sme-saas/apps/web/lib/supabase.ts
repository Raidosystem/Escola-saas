import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(!url || !key){
  // Avoid throwing during local dev without env; create a dummy client pointing to a placeholder URL.
  console.warn('Supabase env vars missing; using placeholder URL. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}
export const supabase = createClient(url || 'http://localhost:54321', key || 'anon-key-placeholder');
