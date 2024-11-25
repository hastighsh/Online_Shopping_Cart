// /api/admin/sales/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';

export async function GET(request) {
  try {
    // Extract the token and check if the user is an admin
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    const { searchParams } = new URL(request.url);
    const customerUsername = searchParams.get('customerUsername');
    const productName = searchParams.get('productName');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where = {};

    if (customerUsername) {
      where.user = {
        username: {
          contains: customerUsername,
          mode: 'insensitive',
        },
      };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (productName) {
      where.items = {
        some: {
          product: {
            name: {
              contains: productName,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    // Fetch orders with items and products
    const orders = await prisma.order.findMany({
        where,
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      
      // Calculate totalAmount and group items by product for each order
      const ordersWithTotals = orders.map((order) => {
        const productQuantities = {};
        
        // Ensure order.items is defined and is an array
        if (Array.isArray(order.items) && order.items.length > 0) {
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
        }
      
        const totalAmount = Object.values(productQuantities).reduce(
          (sum, item) => {
            return sum + item.product.price * item.quantity;
          },
          0
        );
      
        return {
          ...order,
          totalAmount,
          productQuantities: Object.values(productQuantities) || [],
        };
      });
      
      return NextResponse.json(ordersWithTotals);
  } catch (error) {
    console.error('Sales history fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}