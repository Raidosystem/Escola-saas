// Configuração do Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvumfyvwtseouhnjhjom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dW1meXZ3dHNlb3Vobmpoam9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDQ5MDQsImV4cCI6MjA3MDg4MDkwNH0.9QAW8wC_dVkT8YhiCME7hv6yw5FrClq4dkR452IswwY';

export const supabase = createClient(supabaseUrl, supabaseKey);
