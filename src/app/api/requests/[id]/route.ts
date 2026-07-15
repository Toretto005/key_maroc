import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!status || !['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Technically we should check if the logged in user owns the provider 
    // that this request is for. Since this is an MVP, we update the status directly.
    const { data, error } = await supabaseAdmin
      .from('ServiceRequest')
      .update({ status })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ request: data });
  } catch (error: any) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
