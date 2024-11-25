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

    const { quantityToReduce } = data;

    if (typeof quantityToReduce !== 'number' || quantityToReduce <= 0) {
      return NextResponse.json({ error: 'Invalid quantity to reduce' }, { status: 400 });
    }

    // Fetch available inventory count
    const availableCount = await prisma.productItem.count({
      where: {
        productId: productIdInt,
        orderId: null,
      },
    });

    if (quantityToReduce > availableCount) {
      return NextResponse.json(
        { error: 'Cannot reduce more than available inventory' },
        { status: 400 }
      );
    }

    // Delete the specified number of ProductItem records
    const itemsToDelete = await prisma.productItem.findMany({
      where: {
        productId: productIdInt,
        orderId: null,
      },
      take: quantityToReduce,
      select: { id: true },
    });

    const itemIds = itemsToDelete.map((item) => item.id);

    await prisma.productItem.deleteMany({
      where: {
        id: { in: itemIds },
      },
    });

    return NextResponse.json({ message: 'Inventory reduced successfully' });
  } catch (error) {
    console.error('Reduce inventory error:', error);
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status }
    );
  }
}