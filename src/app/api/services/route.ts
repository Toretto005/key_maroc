import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const provider = await prisma.provider.findFirst({
      where: { userId: user.id }
    });

    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider profile not found' }, { status: 404 });
    }

    const services = await prisma.service.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const provider = await prisma.provider.findFirst({
      where: { userId: user.id }
    });

    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, price, duration, imageUrl } = body;

    const newService = await prisma.service.create({
      data: {
        providerId: provider.id,
        name,
        description,
        price,
        duration,
        imageUrl
      }
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
