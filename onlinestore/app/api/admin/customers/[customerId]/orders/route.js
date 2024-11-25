import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma'; // Import Prisma client to interact with the database
import { isAdmin } from '@/util/auth'; // Import function to check admin authentication

export async function GET(request, context) {
  try {
    // Extract the authorization token from the request headers
    const token = request.headers.get('authorization')?.split(' ')[1];
    // Verify if the user is an admin
    await isAdmin(token);

    // Extract customerId from the request context
    const { params } = context;
    const { customerId } = await params;
    const customerIdInt = parseInt(customerId); // Convert customerId to an integer

    // Fetch orders for the given customer ID, including associated items and products
    const orders = await prisma.order.findMany({
      where: { userId: customerIdInt }, // Filter orders by userId
      include: {
        items: { // Include items associated with the order
          include: {
            product: true, // Include product details for each item
          },
        },
      },
    });

    // Process each order to calculate total amounts and group items by product
    const ordersWithTotals = orders.map((order) => {
      const productQuantities = {}; // Object to store product quantities

      // Iterate over items in the order and group them by productId
      order.items.forEach((item) => {
        const productId = item.productId;
        if (productQuantities[productId]) {
          productQuantities[productId].quantity += 1; // Increment quantity if product already exists
        } else {
          productQuantities[productId] = {
            product: item.product, // Store product details
            quantity: 1, // Initialize quantity
          };
        }
      });

      // Calculate the total amount for the order
      const totalAmount = Object.values(productQuantities).reduce((sum, item) => {
        return sum + item.product.price * item.quantity; // Sum up price * quantity for each product
      }, 0);

      return {
        ...order, // Include original order details
        totalAmount, // Add calculated totalAmount
        productQuantities: Object.values(productQuantities), // Convert grouped products to an array
      };
    });

    // Return the processed orders as JSON
    return NextResponse.json(ordersWithTotals);
  } catch (error) {
    console.error('Orders fetch error:', error); // Log any errors

    // Determine appropriate error status (401 for expired token, 500 for other errors)
    const status = error.message === 'Token expired' ? 401 : 500;
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, // Return error message
      { status }
    );
  }
}