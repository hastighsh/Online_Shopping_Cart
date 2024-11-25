// app/admin/products/page.js

'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/util/apiClient';
import styles from './Products.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [quantityChanges, setQuantityChanges] = useState({});

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProducts() {
    try {
      const response = await apiFetch('/api/admin/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Fetch products error:', error);
      alert(error.message);
    }
  }

  function handleQuantityChange(productId, value) {
    setQuantityChanges({
      ...quantityChanges,
      [productId]: parseInt(value),
    });
  }

  async function adjustInventory(productId, action) {
    try {
      const quantityChange = quantityChanges[productId];
      if (isNaN(quantityChange) || quantityChange <= 0) {
        alert('Please enter a positive number for quantity');
        return;
      }

      const endpoint =
        action === 'add'
          ? `/api/admin/products/${productId}/inventory/add`
          : `/api/admin/products/${productId}/inventory/reduce`;

      const body =
        action === 'add'
          ? { quantityToAdd: quantityChange }
          : { quantityToReduce: quantityChange };

      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to adjust inventory');
      }

      await fetchProducts(); // Refresh the product list
      setQuantityChanges({ ...quantityChanges, [productId]: '' });
    } catch (error) {
      console.error('Adjust inventory error:', error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Manage Inventory</h1>
      <table className={styles.productsTable}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Available Inventory</th>
            <th>Quantity</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
            >
              <td>{product.name}</td>
              <td>{product.availableInventory}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={quantityChanges[product.id] || ''}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  className={styles.quantityInput}
                />
              </td>
              <td>
                <button
                  onClick={() => adjustInventory(product.id, 'add')}
                  className={styles.addButton}
                >
                  Add
                </button>
              </td>
              <td>
                <button
                  onClick={() => adjustInventory(product.id, 'reduce')}
                  className={styles.reduceButton}
                >
                  Reduce
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}