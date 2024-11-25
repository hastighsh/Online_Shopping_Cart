// app/api/admin/orders/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    isAdmin(token);

    // Fetch orders with items and products
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // Calculate totalAmount and group items by product for each order
    const ordersWithTotals = orders.map((order) => {
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
    console.error('Order list fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}