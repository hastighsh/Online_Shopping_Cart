// components/AdminLayout.js

import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <ul>
          <li>
            <Link href="/admin">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/customers">Customers</Link>
          </li>
          <li>
            <Link href="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link href="/admin/sales">Sales History</Link>
          </li>
        </ul>
      </nav>
      <main className="admin-content">{children}</main>
    </div>
  );
}