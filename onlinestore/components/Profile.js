"use client";

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/AuthContext'; // Import AuthContext

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl">Profile</h2>
      <p>Email: {userEmail}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-[#F67280] text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}