import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';

export async function POST(request, context) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    const { params } = context;
    const { productId } = await params;
    const productIdInt = parseInt(productId);
    const data = await request.json();

    const { quantityToAdd } = data;

    if (typeof quantityToAdd !== 'number' || quantityToAdd <= 0) {
      return NextResponse.json({ error: 'Invalid quantity to add' }, { status: 400 });
    }

    // Create new ProductItem records
    const createData = Array(quantityToAdd).fill({
      productId: productIdInt,
    });

    await prisma.productItem.createMany({
      data: createData,
    });

    return NextResponse.json({ message: 'Inventory added successfully' });
  } catch (error) {
    console.error('Add inventory error:', error);
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status }
    );
  }
}