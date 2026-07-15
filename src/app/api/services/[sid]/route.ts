import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PUT(request: Request, { params }: { params: Promise<{ sid: string }> }) {
  const { sid } = await params;
  const body = await request.json();
  const { name, description, price, duration } = body;

  const { data, error } = await supabaseAdmin
    .from('Service')
    .update({ name, description, price, duration })
    .eq('id', parseInt(sid))
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ service: data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ sid: string }> }) {
  const { sid } = await params;
  const { error } = await supabaseAdmin
    .from('Service')
    .delete()
    .eq('id', parseInt(sid));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
