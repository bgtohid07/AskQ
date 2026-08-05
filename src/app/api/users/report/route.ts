import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { reportSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = reportSchema.parse(body);

    if (user.id === validatedData.reportedId) {
      return NextResponse.json({ error: 'Cannot report yourself' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        reportedId: validatedData.reportedId,
        reason: validatedData.reason,
        details: validatedData.details
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
