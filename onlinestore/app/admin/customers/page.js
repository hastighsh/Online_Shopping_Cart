// app/admin/customers/page.js

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/util/apiClient';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const response = await apiFetch('/api/admin/customers');
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Fetch customers error:', error);
      alert(error.message);
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <table className="w-full bg-white rounded shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4">Username</th>
            <th className="p-4">Email</th>
            <th className="p-4">Orders</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t">
              <td className="p-4">{customer.username}</td>
              <td className="p-4">{customer.email}</td>
              <td className="p-4">{customer.orders.length}</td>
              <td className="p-4">
                <Link href={`/admin/customers/${customer.id}`}>
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    View/Edit
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
