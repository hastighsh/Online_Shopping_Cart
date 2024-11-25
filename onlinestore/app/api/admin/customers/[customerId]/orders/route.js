// app/api/admin/customers/[customerId]/orders/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';

export async function GET(request, context) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    const { params } = context;
    const { customerId } = await params;
    const customerIdInt = parseInt(customerId);

    // Fetch orders with items and products
    const orders = await prisma.order.findMany({
      where: { userId: customerIdInt },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate totalAmount and group items by product for each order
    const ordersWithTotals = orders.map((order) => {
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

      return {
        ...order,
        totalAmount,
        productQuantities: Object.values(productQuantities),
      };
    });

    return NextResponse.json(ordersWithTotals);
  } catch (error) {
    console.error('Orders fetch error:', error);
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status }
    );
  }
}