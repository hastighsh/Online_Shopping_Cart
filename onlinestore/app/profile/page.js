"use client";

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/AuthContext'; // Adjust the path
import ProfileForm from '@/components/ProfileForm';
import PurchaseHistory from '@/components/PurchaseHistory';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        // Handle unauthorized or other errors
        logout();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Profile</h2>
      <ProfileForm userData={userData} />
      <PurchaseHistory orders={userData.orders} />
    </div>
  );
}
