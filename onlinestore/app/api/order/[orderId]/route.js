// app/api/order/[orderId]/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { verifyToken } from '@/util/auth';

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId;
    const orderId = parseInt(params.orderId);

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Calculate total amount
    const totalAmount = order.items.reduce((total, item) => {
      return total + item.product.price;
    }, 0);

    return NextResponse.json({
      ...order,
      totalAmount,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}