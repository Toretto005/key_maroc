import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from('ServiceRequest')
    .select('*, Service(name), Provider(name, phone)')
    .limit(1);

  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
main();
