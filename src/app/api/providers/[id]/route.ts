import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const providerId = parseInt(id);

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('Provider')
      .select('userId')
      .eq('id', providerId)
      .single();

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, about, phone, lat, lng } = body;

    const { data: provider, error } = await supabaseAdmin
      .from('Provider')
      .update({
        name,
        address,
        about,
        phone: phone || '',
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      })
      .eq('id', providerId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, provider });
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }
}
