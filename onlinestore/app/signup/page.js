"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/signup', formData);
            if (response.status === 200) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Signup error", error);
        }
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
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                    Sign Up
                </button>
            </form>
        </div>
    );
}
