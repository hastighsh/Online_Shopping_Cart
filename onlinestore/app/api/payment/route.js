// app/api/payment/route.js

import { NextResponse } from 'next/server';

let paymentAttemptCount = 0;

export async function POST(request) {
  try {
    // Increment the attempt count
    paymentAttemptCount += 1;

    // Simple algorithm: deny every 3rd payment attempt
    const isPaymentAccepted = paymentAttemptCount % 3 !== 0;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isPaymentAccepted) {
      return NextResponse.json({ status: 'accepted' });
    } else {
      return NextResponse.json(
        { status: 'rejected', error: 'Credit Card Authorization Failed.' },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}