import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const serviceId = parseInt(id, 10);
    const body = await req.json();
    const { name, description, price, duration } = body;

    // Verify ownership
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!existingService || existingService.providerId !== provider.id) {
      return NextResponse.json({ success: false, error: 'Not authorized or service not found' }, { status: 403 });
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description,
        price,
        duration
      }
    });

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    
    const { id } = await params;
    const serviceId = parseInt(id, 10);

    // Verify ownership
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!existingService || existingService.providerId !== provider.id) {
      return NextResponse.json({ success: false, error: 'Not authorized or service not found' }, { status: 403 });
    }

    await prisma.service.delete({
      where: { id: serviceId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
