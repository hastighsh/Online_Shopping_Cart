// app/checkout/page.js

'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/AuthContext';
import CheckoutForm from '@/components/CheckoutForm';
import LoginPrompt from '@/components/LoginPrompt';

export default function CheckoutPage() {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  /* Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems]);
  */
    // Fetch latest order and redirect to Order Summary page
    useEffect(() => {
      const fetchLatestOrderAndRedirect = async () => {
        try {
          const response = await fetch('/api/order/[orderId]/route');
          if (response.ok) {
            const order = await response.json();
            router.push(`/OrderSummaryClient/${order.id}`);
          } else {
            console.error('Failed to fetch the latest order.');
          }
        } catch (error) {
          console.error('Error fetching latest order:', error);
        }
      };
    }, [isAuthenticated, router]); // Verifying authentication

  // Fetch user data if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <CheckoutForm cartItems={cartItems} userData={userData} />
    </div>
  );
}