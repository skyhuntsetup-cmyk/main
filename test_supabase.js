import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: alerts, error: alertErr } = await supabase.from('price_alerts').select('*').limit(1);
  console.log('price_alerts:', alertErr ? alertErr.message : 'exists');

  const { data: searches, error: searchErr } = await supabase.from('recent_searches').select('*').limit(1);
  console.log('recent_searches:', searchErr ? searchErr.message : 'exists');
}

test();
