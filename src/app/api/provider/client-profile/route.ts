import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  
  if (!phone) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
  }
  
  try {
    // Fetch users (Note: in production a dedicated public.users table is better for scaling)
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000
    });
    
    if (error) {
      throw error;
    }
    
    // Find the client by phone
    const clientUser = users.find(u => u.user_metadata?.phone === phone && u.user_metadata?.role === 'client');
    
    if (clientUser) {
      return NextResponse.json({ 
        client: {
          name: clientUser.user_metadata?.full_name || 'Client',
          phone: clientUser.user_metadata?.phone,
          avatarUrl: clientUser.user_metadata?.avatar_url || null,
          email: clientUser.email,
        }
      });
    }
    
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
