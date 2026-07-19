require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    await client.connect();
    
    // Policy to allow insert
    await client.query(`
      CREATE POLICY "Allow public uploads to provider_avatars" 
      ON storage.objects FOR INSERT TO public 
      WITH CHECK (bucket_id = 'provider_avatars');
    `);
    console.log('Created INSERT policy');
    
    // Policy to allow update
    await client.query(`
      CREATE POLICY "Allow public updates to provider_avatars" 
      ON storage.objects FOR UPDATE TO public 
      USING (bucket_id = 'provider_avatars');
    `);
    console.log('Created UPDATE policy');
    
    // Policy to allow delete
    await client.query(`
      CREATE POLICY "Allow public deletes to provider_avatars" 
      ON storage.objects FOR DELETE TO public 
      USING (bucket_id = 'provider_avatars');
    `);
    console.log('Created DELETE policy');

  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Policy already exists.');
    } else {
      console.error('Error creating policies:', err);
    }
  } finally {
    await client.end();
  }
}

main();
