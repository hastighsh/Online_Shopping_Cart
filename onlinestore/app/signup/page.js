"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: '', form: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!emailRegex.test(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Please enter a valid email address.',
      }));
      isValid = false;
    }

    if (!passwordRegex.test(formData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character.',
      }));
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Optionally, log the user in automatically
        // For now, redirect to the login page
        router.push('/login');
      } else {
        // Handle server-side errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: data.error || 'An error occurred. Please try again.',
        }));
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: 'An unexpected error occurred. Please try again later.',
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            required
          />
          <div
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </div>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        <button type="submit" className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
}