"use client";

import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react';
import Button from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login({ onLoginSuccess }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem('token', token); // Store the token in localStorage

        if (onLoginSuccess) {
          onLoginSuccess(); // Update authentication state in parent component
        }

        // Redirect the user to the home page or previous page
        router.push('/');
      } else {
        // Handle errors by displaying the error message
        setErrorMessage(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  }

  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
      <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>
        Log In
      </h3>
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4'>
        <input
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-[#F67280] focus:border-[#F67280] py-2 sm:py-3 border border-solid border-[#F8B195] rounded-full outline-none'
          placeholder='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-[#F67280] focus:border-[#F67280] py-2 sm:py-3 border border-solid border-[#F8B195] rounded-full outline-none'
          placeholder='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && (
          <p className='text-red-500 text-center'>{errorMessage}</p>
        )}
        <div className="max-w-[400px] w-full mx-auto">
          <Button text="Submit" full type="submit" />
        </div>
      </form>
      <div>
        Don't have an account?{' '}
        <Link href="/signup">
          <span className='text-[#F67280] cursor-pointer'>Sign Up</span>
        </Link>
      </div>
    </div>
  );

  
}