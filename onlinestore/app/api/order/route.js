// app/api/order/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma'; 
import { verifyToken } from '@/util/auth'; 

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId;

    const {
      cartItems,
      shippingAddress,
      billingInfo, // For payment processing
    } = await request.json();

    // Validate inventory levels
    for (const item of cartItems) {
      const availableCount = await prisma.productItem.count({
        where: {
          productId: item.id,
          orderId: null,
        },
      });

      if (item.quantity > availableCount) {
        return NextResponse.json(
          {
            error: `Not enough inventory for ${item.name}. Available: ${availableCount}`,
          },
          { status: 400 }
        );
      }
    }

    // Create or find shipping address
    let { id: shippingId, ...shippingAddressData } = shippingAddress;
    let shippingAddressRecord = await prisma.address.findFirst({
      where: shippingAddressData,
    });

    if (!shippingAddressRecord) {
      shippingAddressRecord = await prisma.address.create({
        data: shippingAddressData,
      });
    }

    // Simulate payment processing
    const paymentAccepted = await simulatePaymentProcessing(billingInfo);

    if (!paymentAccepted) {
      return NextResponse.json(
        { error: 'Credit Card Authorization Failed.' },
        { status: 402 } // Payment Required
      );
    }

    shippingId = shippingAddressRecord.id;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'Pending',
        shippingAddressId: shippingId,
      },
    });

    // Assign ProductItems to the order
    for (const item of cartItems) {
      const productItems = await prisma.productItem.findMany({
        where: {
          productId: item.id,
          orderId: null,
        },
        take: item.quantity,
      });

      const productItemIds = productItems.map((pi) => pi.id);

      await prisma.productItem.updateMany({
        where: {
          id: { in: productItemIds },
        },
        data: {
          orderId: order.id,
        },
      });
    }

    // Return the order ID upon successful order placement
    return NextResponse.json({
      message: 'Order placed successfully',
      orderId: order.id,
    });
  } catch (error) {
    console.error('Order placement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simulate payment processing function
async function simulatePaymentProcessing(billingInfo) {
  //deny every 3rd request

  // store a counter in memory (note this will reset on server restart)
  if (!global.paymentAttemptCount) {
    global.paymentAttemptCount = 0;
  }
  global.paymentAttemptCount += 1;

  // Deny every 3rd payment attempt
  const isPaymentAccepted = global.paymentAttemptCount % 3 !== 0;

  // Simulate processing delay
  //await new Promise((resolve) => setTimeout(resolve, 1000));

  return isPaymentAccepted;
}