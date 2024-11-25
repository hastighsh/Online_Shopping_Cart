// app/admin/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/OrderList.module.css';

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Order fetch error:', error);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user.username}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link href={`/admin/orders/${order.id}`} className={styles.button}>
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
