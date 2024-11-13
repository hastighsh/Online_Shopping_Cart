"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') {
            setErrors({ ...errors, email: '' });
        }
        if (name === 'password') {
            setErrors({ ...errors, password: '' });
        }
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
                password: 'Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character.',
            }));
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await axios.post('/api/user/signup', formData);
            if (response.status === 200) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Signup error", error);
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

                <button type="submit" className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                    Sign Up
                </button>
            </form>
        </div>
    );
}