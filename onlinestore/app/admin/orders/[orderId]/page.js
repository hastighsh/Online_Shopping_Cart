// app/admin/orders/[orderId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/OrderDetails.module.css';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  async function fetchOrder() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      alert(error.message);
    }
  }

  if (!order) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Order Details</h1>
      <div className={styles.orderInfo}>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Customer:</strong> {order.user.username}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <h2 className={styles.subheading}>Items</h2>
      <ul className={styles.itemList}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.product.name} - ${item.product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}