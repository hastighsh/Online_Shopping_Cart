// components/LoginPrompt.js
//If you try and checkout while not logged in.
'use client';

import Link from 'next/link';

export default function LoginPrompt() {
  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-4">Please Log In or Sign Up to Continue</h2>
      <div className="flex justify-center gap-4">
        <Link href="/login">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Log In</button>
        </Link>
        <Link href="/signup">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}