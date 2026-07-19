import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const phone = session.user.user_metadata?.phone;
    if (!phone) {
      return NextResponse.json({ requests: [] });
    }

    const { data: requests, error } = await supabaseAdmin
      .from('ServiceRequest')
      .select('*, Service(name), Provider(name, phone)')
      .eq('clientPhone', phone)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Error fetching client requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
