import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('Checking service_images bucket...');
  const { data: buckets, error: getErr } = await supabase.storage.listBuckets();
  if (getErr) {
    console.error('Error listing buckets:', getErr);
    return;
  }
  
  const exists = buckets.find(b => b.name === 'service_images');
  if (!exists) {
    console.log('Creating service_images bucket...');
    const { data, error } = await supabase.storage.createBucket('service_images', { public: true });
    if (error) console.error('Error creating bucket:', error);
    else console.log('Bucket created!');
  } else {
    console.log('Bucket already exists.');
    if (!exists.public) {
      console.log('Updating bucket to be public...');
      await supabase.storage.updateBucket('service_images', { public: true });
    }
  }
}
main();
