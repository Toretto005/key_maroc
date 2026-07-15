import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, serviceId, clientName, clientPhone, notes } = body;

    if (!providerId || !clientName || !clientPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('ServiceRequest')
      .insert([
        {
          providerId,
          serviceId,
          clientName,
          clientPhone,
          notes,
          status: 'PENDING'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ request: data });
  } catch (error: any) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // First get the provider IDs owned by this user
    const { data: providers, error: provError } = await supabaseAdmin
      .from('Provider')
      .select('id')
      .eq('userId', userId);

    if (provError) throw provError;

    const providerIds = providers.map(p => p.id);

    if (providerIds.length === 0) {
      return NextResponse.json({ requests: [] });
    }

    // Then fetch requests for those providers, and join the Service details
    const { data: requests, error: reqError } = await supabaseAdmin
      .from('ServiceRequest')
      .select('*, Service(name)')
      .in('providerId', providerIds)
      .order('createdAt', { ascending: false });

    if (reqError) throw reqError;

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
