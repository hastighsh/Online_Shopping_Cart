import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    // Fetch products with available inventory counts
    const products = await prisma.product.findMany({
      include: {
        _count: {
          select: {
            productItems: {
              where: {
                orderId: null,
              },
            },
          },
        },
      },
    });

    // Map the products to include the available inventory count
    const productsWithInventory = products.map((product) => ({
      ...product,
      availableInventory: product._count.productItems,
    }));

    return NextResponse.json(productsWithInventory);
  } catch (error) {
    console.error('Products fetch error:', error);
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status }
    );
  }
}