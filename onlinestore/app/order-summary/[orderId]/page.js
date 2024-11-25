// app/order-summary/[orderId]/page.js

import OrderSummaryClient from './OrderSummaryClient';

export default async function OrderSummaryPage({ params }) {
    
  const { orderId } = await params;

  return <OrderSummaryClient orderId={orderId} />;
}