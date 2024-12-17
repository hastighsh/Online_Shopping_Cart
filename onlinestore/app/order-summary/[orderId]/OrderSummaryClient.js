'use client';

import { useEffect, useState } from 'react';

export default function OrderSummaryClient({ orderId }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [cardLast4, setCardLast4] = useState('');


  useEffect(() => {
    // Get cardLast4 from sessionStorage
    const storedCardLast4 = sessionStorage.getItem('cardLast4');
  
    if (storedCardLast4 && storedCardLast4.length > 4) {
      // Truncate to the last 4 digits if length is greater than 4
      setCardLast4(storedCardLast4.slice(-4));
    } else {
      setCardLast4(storedCardLast4);
    }
  }, []);
  
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
      <p><strong>Card:</strong> **** **** **** {cardLast4} </p>
      <p><strong>Status:</strong> {orderDetails.status}</p>
      <p><strong>Total:</strong> ${orderDetails.totalAmount?.toFixed(2)}</p>
      <h2 className="text-xl font-bold mt-4">Items:</h2>
      <ul> 
      {orderDetails.items.reduce((acc, item) => {
        const productId = item.product.id;
        const existingItem = acc.find(i => i.productId === productId);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          acc.push({ productId, productName: item.product.name, price: item.product.price, quantity: 1 });
        }

        return acc;
      }, []).map((product) => (
        <li key={product.productId}>
          {product.productName} x {product.quantity} - ${product.price.toFixed(2)}
        </li>
        ))}
      </ul>
    </div>
  );
}