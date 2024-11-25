// app/api/admin/customers/[customerId]/route.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { isAdmin } from '@/util/auth';
import { hash } from 'bcryptjs';

export async function GET(request, context) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    const { params } = context;
    const { customerId } = await params;
    const customerIdInt = parseInt(customerId);

    const customer = await prisma.user.findUnique({
      where: { id: customerIdInt },
      include: {
        shippingAddress: true,
        creditCard: {
          include: {
            billingAddress: true,
          },
        },
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Customer fetch error:', error);
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status }
    );
  }
}

export async function PUT(request, context) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    await isAdmin(token);

    const { params } = context;
    const { customerId } = await params;
    const customerIdInt = parseInt(customerId);
    const data = await request.json();

    // Validate and sanitize input
    const updateData = {};

    if (data.username && typeof data.username === 'string') {
      updateData.username = data.username;
    }

    if (data.email && typeof data.email === 'string') {
      updateData.email = data.email;
    }

    if (data.password && typeof data.password === 'string') {
      const hashedPassword = await hash(data.password, 10);
      updateData.password = hashedPassword;
    }

    // Update shipping address if provided
    if (data.shippingAddress) {
      const shippingAddressData = data.shippingAddress;
      if (shippingAddressData.id) {
        await prisma.address.update({
          where: { id: shippingAddressData.id },
          data: shippingAddressData,
        });
      } else {
        const newAddress = await prisma.address.create({
          data: shippingAddressData,
        });
        updateData.shippingAddressId = newAddress.id;
      }
    }

    // Update credit card info if provided
    if (data.creditCard) {
      const creditCardData = data.creditCard;

      // Update billing address first
      if (creditCardData.billingAddress) {
        const billingAddressData = creditCardData.billingAddress;
        if (billingAddressData.id) {
          await prisma.address.update({
            where: { id: billingAddressData.id },
            data: billingAddressData,
          });
        } else {
          const newBillingAddress = await prisma.address.create({
            data: billingAddressData,
          });
          creditCardData.billingAddressId = newBillingAddress.id;
        }
      }

      // Update credit card info
      if (creditCardData.id) {
        await prisma.creditCardInfo.update({
          where: { id: creditCardData.id },
          data: {
            ...creditCardData,
            billingAddress: undefined, 
          },
        });
      } else {
        const newCreditCard = await prisma.creditCardInfo.create({
          data: {
            ...creditCardData,
            billingAddress: undefined, 
            billingAddressId: creditCardData.billingAddressId,
          },
        });
        updateData.creditCardId = newCreditCard.id;
      }
    }

    // Update the customer
    const updatedCustomer = await prisma.user.update({
      where: { id: customerIdInt },
      data: updateData,
      include: {
        shippingAddress: true,
        creditCard: {
          include: {
            billingAddress: true,
          },
        },
        orders: true,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Customer update error:', error);
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status }
    );
  }
}