"use client";

import { Fugaz_One } from 'next/font/google';
import React, { useState, useContext } from 'react';
import Button from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/AuthContext'; // Import AuthContext
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext); // Use the login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      // Send a POST request to your login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, isAdmin } = data;
        // Use the login function from context
        login(token);

        if (isAdmin) {
          router.push('/admin'); // redirect admin users to /admin
        } else {
          router.push('/catalog'); // redirect non-admin users to /
        }
      } else {
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
        <div className="relative w-full max-w-[400px] mx-auto">
          <input
              className="w-full px-3 duration-200 hover:border-[#F67280] focus:border-[#F67280] py-2 sm:py-3 border border-solid border-[#F8B195] rounded-full outline-none"
              placeholder="Password"
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            {passwordVisible ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
          </div>
        </div>

        {errorMessage && (
            <p className='text-red-500 text-center'>{errorMessage}</p>
        )}
        <div className="max-w-[400px] w-full mx-auto">
          <Button text="Submit" full type="submit"/>
        </div>
      </form>
      <div>
        Don&#39;t have an account?{' '}
        <Link href="/signup">
          <span className='text-[#F67280] cursor-pointer'>Sign Up</span>
        </Link>
      </div>
    </div>
  );


}