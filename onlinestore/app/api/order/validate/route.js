// app/api/order/validate/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    for (const item of cartItems) {
      const availableCount = await prisma.productItem.count({
        where: {
          productId: item.id,
          orderId: null,
        },
      });

      if (item.quantity > availableCount) {
        return NextResponse.json(
          { error: `Not enough inventory for ${item.name}. Available: ${availableCount}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: 'Validation successful' });
  } catch (error) {
    console.error('Inventory validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}