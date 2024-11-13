'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const sampleItems = [
    {
        id: 1,
        name: 'Handmade Woolen Scarf',
        price: 49.99,
        image: 'https://placehold.co/400.png?text=Woolen+Scarf',
        description: 'A cozy woolen scarf, perfect for winter.',
        category: 'Accessories',
        brand: 'CozyWear',
        quantity: 1,
    },
    {
        id: 2,
        name: 'Leather Wallet',
        price: 79.99,
        image: 'https://placehold.co/400.png?text=Leather+Wallet',
        description: 'A durable leather wallet, handcrafted.',
        category: 'Accessories',
        brand: 'LeatherWorks',
        quantity: 1,
    },
];

const Cart = () => {
    const [cartItems, setCartItems] = useState(sampleItems);
    const router = useRouter();

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleContinueShopping = () => {
        router.push('/catalog');
    };

    return (
        <div className="cart-container p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600">Your shopping cart is currently empty.</p>
            ) : (
                <div>
                    <div className="cart-items mb-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item flex justify-between items-center border-b py-4">
                                <div className="flex items-center flex-grow">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="quantity-control flex items-center">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="bg-gray-300 text-black px-2 py-1 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="bg-gray-300 text-black px-2 py-1 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="remove-item ml-4">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="total-price text-right mb-6">
                        <h2 className="text-xl font-semibold">Total: ${calculateTotal()}</h2>
                    </div>
                    <div className="cart-actions flex justify-between">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleContinueShopping}
                        >
                            Continue Shopping
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={() => alert('Checkout functionality to be implemented')}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;