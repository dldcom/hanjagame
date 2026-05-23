import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgwvclrytjtmbvjgnjdl.supabase.co';
const supabaseKey = 'sb_publishable_VB2qjoXbNEcvX_R6lt6_1g_XiIqwhPf';

export const supabase = createClient(supabaseUrl, supabaseKey);
