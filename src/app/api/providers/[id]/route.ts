import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    const existing = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { userId: true }
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, about, phone, lat, lng, skills, certifications, businessHours, email, avatarUrl, bannerUrl } = body;

    const provider = await prisma.provider.update({
      where: { id: providerId },
      data: {
        name,
        address,
        about,
        phone: phone || '',
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        skills,
        certifications,
        businessHours,
        email,
        avatarUrl,
        bannerUrl
      }
    });

    return NextResponse.json({ success: true, provider });
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }
}
