import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { name, address, about, phone, lat, lng, skills } = body;

    const { data: provider, error } = await supabaseAdmin
      .from('Provider')
      .insert([{
        name,
        address,
        about,
        phone: phone || '',
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        skills: skills || '',
        rating: 5.0,
        reviews: 0,
        userId: user?.id ?? null,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, provider }, { status: 201 });
  } catch (error) {
    console.error('Error creating provider:', error);
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
  }
}

