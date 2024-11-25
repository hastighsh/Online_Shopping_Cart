// app/admin/sales/page.js
// app/admin/sales/page.js

'use client';

import { useState, useEffect } from 'react';
import styles from './Sales.module.css';

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({
    customerUsername: '',
    productName: '',
    startDate: '',
    endDate: '',
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSales() {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/admin/sales?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setSales(data);
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleFilterSubmit(e) {
    e.preventDefault();
    fetchSales();
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sales History</h1>
      <form className={styles.filterForm} onSubmit={handleFilterSubmit}>
        <div className={styles.formGroup}>
          <label>Customer Username</label>
          <input
            name="customerUsername"
            value={filters.customerUsername}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Product Name</label>
          <input
            name="productName"
            value={filters.productName}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <button className={styles.filterButton} type="submit">
          Filter
        </button>
      </form>
      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((order) => (
            <tr key={order.id} onClick={() => setSelectedOrder(order)}>
              <td>{order.id}</td>
              <td>{order.user.username}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <p>
              <strong>User:</strong> {selectedOrder.user.username}
            </p>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <table className={styles.orderDetailsTable}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.productQuantities &&
                selectedOrder.productQuantities.length > 0 ? (
                  selectedOrder.productQuantities.map((item) => (
                    <tr key={item.product.id}>
                      <td>{item.product.name}</td>
                      <td>${item.product.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No products in this order.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className={styles.closeButton} onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}