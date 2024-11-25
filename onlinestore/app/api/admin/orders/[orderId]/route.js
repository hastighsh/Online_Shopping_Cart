// app/api/admin/orders/[orderId]/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';

export async function GET(request, context) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    const { params } = context;
    const { orderId } = await params;
    const orderIdInt = parseInt(orderId);

    // Fetch the order with items and products
    const order = await prisma.order.findUnique({
      where: { id: orderIdInt },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Group items by productId to determine quantities
    const productQuantities = {};
    order.items.forEach((item) => {
      const productId = item.productId;
      if (productQuantities[productId]) {
        productQuantities[productId].quantity += 1;
      } else {
        productQuantities[productId] = {
          product: item.product,
          quantity: 1,
        };
      }
    });

    // Calculate totalAmount
    const totalAmount = Object.values(productQuantities).reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const orderWithTotal = {
      ...order,
      totalAmount,
      productQuantities: Object.values(productQuantities),
    };

    return NextResponse.json(orderWithTotal);
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
