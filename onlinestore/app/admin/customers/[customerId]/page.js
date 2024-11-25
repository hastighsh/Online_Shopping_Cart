// app/admin/customers/[customerId]/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/util/apiClient';
import styles from './Customer.module.css';

export default function CustomerPage() {
  const { customerId } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
      fetchOrders();
    }
  }, [customerId]);

  async function fetchCustomer() {
    try {
      const response = await apiFetch(`/api/admin/customers/${customerId}`);
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch customer data');
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      console.error('Fetch customer error:', error);
      alert(error.message);
    }
  }

  async function fetchOrders() {
    try {
      const response = await apiFetch(`/api/admin/customers/${customerId}/orders`);
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch order data');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      alert(error.message);
    }
  }

  async function updateCustomer() {
    try {
      const response = await apiFetch(`/api/admin/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to update customer data');
      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer);
      setEditMode(false);
    } catch (error) {
      console.error('Update customer error:', error);
      alert(error.message);
    }
  }

  if (!customer) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>Customer Details</h1>
      <div className={styles.customerInfo}>
        <label>
          Username:
          <input
            type="text"
            value={customer.username || ''}
            readOnly={!editMode}
            onChange={(e) => setCustomer({ ...customer, username: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={customer.email || ''}
            readOnly={!editMode}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />
        </label>
        {/* Shipping Address Fields */}
        <h3>Shipping Address</h3>
        <label>
          Street:
          <input
            type="text"
            value={customer.shippingAddress?.street || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                shippingAddress: {
                  ...customer.shippingAddress,
                  street: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={customer.shippingAddress?.city || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                shippingAddress: {
                  ...customer.shippingAddress,
                  city: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Province:
          <input
            type="text"
            value={customer.shippingAddress?.province || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                shippingAddress: {
                  ...customer.shippingAddress,
                  province: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Postal Code:
          <input
            type="text"
            value={customer.shippingAddress?.postalCode || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                shippingAddress: {
                  ...customer.shippingAddress,
                  postalCode: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            value={customer.shippingAddress?.country || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                shippingAddress: {
                  ...customer.shippingAddress,
                  country: e.target.value,
                },
              })
            }
          />
        </label>
        {/*Credit Card Information Fields */}
        <h3>Credit Card Information</h3>
        <label>
          Card Holder:
          <input
            type="text"
            value={customer.creditCard?.cardHolder || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  cardHolder: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Card Number:
          <input
            type="text"
            value={customer.creditCard?.cardLast4 || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  cardLast4: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Card Type:
          <input
            type="text"
            value={customer.creditCard?.cardType || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  cardType: e.target.value,
                },
              })
            }
          />
        </label>
        <label>
          Expiration Date:
          <input
            type="date"
            value={
              customer.creditCard?.expiration
                ? new Date(customer.creditCard.expiration).toISOString().split('T')[0]
                : ''
            }
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  expiration: new Date(e.target.value).toISOString(),
                },
              })
            }
          />
        </label>
        {/* Billing Address Fields */}
        <h4>Billing Address</h4>
        <label>
          Street:
          <input
            type="text"
            value={customer.creditCard?.billingAddress?.street || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  billingAddress: {
                    ...customer.creditCard.billingAddress,
                    street: e.target.value,
                  },
                },
              })
            }
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={customer.creditCard?.billingAddress?.city || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  billingAddress: {
                    ...customer.creditCard.billingAddress,
                    city: e.target.value,
                  },
                },
              })
            }
          />
        </label>
        <label>
          Province:
          <input
            type="text"
            value={customer.creditCard?.billingAddress?.province || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  billingAddress: {
                    ...customer.creditCard.billingAddress,
                    province: e.target.value,
                  },
                },
              })
            }
          />
        </label>
        <label>
          Postal Code:
          <input
            type="text"
            value={customer.creditCard?.billingAddress?.postalCode || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  billingAddress: {
                    ...customer.creditCard.billingAddress,
                    postalCode: e.target.value,
                  },
                },
              })
            }
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            value={customer.creditCard?.billingAddress?.country || ''}
            readOnly={!editMode}
            onChange={(e) =>
              setCustomer({
                ...customer,
                creditCard: {
                  ...customer.creditCard,
                  billingAddress: {
                    ...customer.creditCard.billingAddress,
                    country: e.target.value,
                  },
                },
              })
            }
          />
        </label>
        {editMode ? (
          <button onClick={updateCustomer}>Save</button>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit</button>
        )}
      </div>

      <h2>Purchase History</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} onClick={() => setSelectedOrder(order)}>
              <td>{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className={styles.modal}>
          <h3>Order Details</h3>
          <p>Order ID: {selectedOrder.id}</p>
          <p>Total Amount: ${selectedOrder.totalAmount.toFixed(2)}</p>
          <p>Status: {selectedOrder.status}</p>
          <ul>
            {selectedOrder.productQuantities.map((item) => (
              <li key={item.product.id}>
                {item.product.name} - ${item.product.price.toFixed(2)} x {item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}
    </div>
  );
}