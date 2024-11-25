'use client';

import { useEffect, useState } from 'react';

export default function OrderSummaryClient({ orderId }) {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          console.error('Failed to fetch order details.');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="order-summary-container p-4">
      <h1 className="text-3xl font-bold mb-4">Order Summary</h1>
      <p><strong>Order ID:</strong> {orderDetails.id}</p>
      <p><strong>Date:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
      <p><strong>Shipping Address:</strong></p>
      <p>{orderDetails.shippingAddress.street}</p>
      <p>
        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.province}
      </p>
      <p>
        {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
      </p>
      <p><strong>Status:</strong> {orderDetails.status}</p>
      <p><strong>Total:</strong> ${orderDetails.totalAmount?.toFixed(2)}</p>
      <h2 className="text-xl font-bold mt-4">Items:</h2>
      <ul>
        {orderDetails.items.map((item) => (
          <li key={item.id}>
            {item.product.name} x {item.quantity} - ${item.product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}