import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  if (!latParam || !lngParam) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const userLat = parseFloat(latParam);
  const userLng = parseFloat(lngParam);

  try {
    const { data: providers, error } = await supabaseAdmin
      .from('Provider')
      .select('*');

    if (error) throw error;

    // Calculate distance (Haversine formula) and sort
    const providersWithDistance = (providers || []).map((provider: any) => {
      const R = 6371; // Earth radius in km
      const dLat = (provider.lat - userLat) * (Math.PI / 180);
      const dLng = (provider.lng - userLng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(userLat * (Math.PI / 180)) *
          Math.cos(provider.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) ** 2;
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return {
        ...provider,
        distance,
        distanceStr: distance < 1
          ? `${Math.round(distance * 1000)}m`
          : `${distance.toFixed(1)}km`,
      };
    });

    providersWithDistance.sort((a: any, b: any) => a.distance - b.distance);

    return NextResponse.json({ success: true, providers: providersWithDistance });
  } catch (error) {
    console.error('Error fetching nearby providers:', error);
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
  }
}
