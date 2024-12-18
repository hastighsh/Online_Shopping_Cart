// app/admin/layout.js

import Link from 'next/link';
import styles from './admin.module.css';

export const metadata = {
  title: 'Admin',
};

export default function AdminLayout({ children }) {
  return (
      <div className={styles.adminContainer}>
        <nav className={styles.adminNav}>
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
            <li>
              <Link href="/admin/products">Product Management</Link>
            </li>
            <li>
              <Link href="/admin/add-products">Add Products</Link>
            </li>
          </ul>
        </nav>
        <main className={styles.adminContent}>{children}</main>
      </div>
  );
}
