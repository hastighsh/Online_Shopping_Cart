import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { verifyToken } from '@/util/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Exclude sensitive fields
    delete user.password;

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
    try {
      const token = request.headers.get('authorization')?.split(' ')[1];
  
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const decoded = verifyToken(token);
      let data;
      try {
        data = await request.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
      }
  
      if (!data || Object.keys(data).length === 0) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
      }
  
      // Create the update object dynamically based on what was provided
      const updateData = {};
  
      if (data.username) {
        updateData.username = data.username;
      }
  
      // Handle Shipping Address
      if (data.shippingAddress) {
        let shippingAddressId = null;
  
        // Validate the shipping address fields
        const { street, city, province, postalCode, country } = data.shippingAddress;
        if (street && city && province && postalCode && country) {
          // Check if the address already exists
          const existingAddress = await prisma.address.findFirst({
            where: { street, city, province, postalCode, country },
          });
  
          if (existingAddress) {
            shippingAddressId = existingAddress.id;
          } else {
            // Create new address
            const newAddress = await prisma.address.create({
              data: { street, city, province, postalCode, country },
            });
            shippingAddressId = newAddress.id;
          }
        } else {
          console.error('Incomplete address information provided:', data.shippingAddress);
          return NextResponse.json({ error: 'Incomplete address information provided.' }, { status: 400 });
        }
  
        if (shippingAddressId) {
          updateData.shippingAddressId = shippingAddressId;
        }
      }
  
      // Handle Credit Card
      if (data.creditCard) {
        let creditCardId = null;
  
        const {
          cardHolder, cardLast4, cardType, expiration, billingAddress,
        } = data.creditCard;
  
        if (cardHolder && cardLast4 && cardType && expiration && billingAddress) {
          const { street, city, province, postalCode, country } = billingAddress;
  
          if (street && city && province && postalCode && country) {
            // Check if the billing address already exists
            const existingBillingAddress = await prisma.address.findFirst({
              where: { street, city, province, postalCode, country },
            });
  
            let billingAddressId = null;
            if (existingBillingAddress) {
              billingAddressId = existingBillingAddress.id;
            } else {
              const newBillingAddress = await prisma.address.create({
                data: { street, city, province, postalCode, country },
              });
              billingAddressId = newBillingAddress.id;
            }
  
            // Check if the credit card already exists
            const existingCard = await prisma.creditCardInfo.findFirst({
              where: {
                cardHolder,
                cardLast4,
                cardType,
                expiration: new Date(expiration),
                billingAddressId,
              },
            });
  
            if (existingCard) {
              creditCardId = existingCard.id;
            } else {
              // Create new credit card
              const newCreditCard = await prisma.creditCardInfo.create({
                data: {
                  cardHolder,
                  cardLast4,
                  cardType,
                  expiration: new Date(expiration),
                  billingAddressId,
                },
              });
              creditCardId = newCreditCard.id;
            }
          } else {
            console.error('Incomplete billing address information provided:', billingAddress);
            return NextResponse.json({ error: 'Incomplete billing address information provided.' }, { status: 400 });
          }
        } else {
          console.error('Incomplete credit card information provided:', data.creditCard);
          return NextResponse.json({ error: 'Incomplete credit card information provided.' }, { status: 400 });
        }
  
        if (creditCardId) {
          updateData.creditCardId = creditCardId;
        }
      }
  
      if (Object.keys(updateData).length > 0) {
        // Update user information if there's anything to update
        await prisma.user.update({
          where: { id: decoded.userId },
          data: updateData,
        });
      } else {
        return NextResponse.json({ error: 'No valid data to update.' }, { status: 400 });
      }
  
      return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }