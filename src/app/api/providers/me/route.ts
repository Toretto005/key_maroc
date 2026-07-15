import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: provider, error } = await supabaseAdmin
      .from('Provider')
      .select('*')
      .eq('userId', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      throw error;
    }

    return NextResponse.json({ success: true, provider: provider || null });
  } catch (error) {
    console.error('Error fetching my provider profile:', error);
    return NextResponse.json({ error: 'Failed to fetch provider' }, { status: 500 });
  }
}
