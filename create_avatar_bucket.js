require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const bucketName = 'provider_avatars';
  
  // Create bucket if it doesn't exist
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    fileSizeLimit: 5242880 // 5MB
  });
  
  if (error) {
    if (error.message.includes('already exists')) {
      console.log(`Bucket '${bucketName}' already exists. Updating to public...`);
      await supabase.storage.updateBucket(bucketName, { public: true });
    } else {
      console.error('Error creating bucket:', error);
      process.exit(1);
    }
  } else {
    console.log(`Bucket '${bucketName}' created successfully.`);
  }

  console.log("Bucket is ready!");
}

main();
