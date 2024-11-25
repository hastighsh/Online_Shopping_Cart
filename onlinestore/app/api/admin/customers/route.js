// app/api/admin/customers/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    const customers = await prisma.user.findMany({
      where: {
        isAdmin: false,
      },
      include: {
        orders: true,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Customer list fetch error:', error);
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status });
  }
}