import React from 'react';

const Cart = () => {
    return (
        <div className="cart-container">
            <h1 className="text-3xl font-bold text-center">Shopping Cart</h1>
            <p className="text-center text-gray-600">Your shopping cart is currently empty.</p>

            {/* add Cart Items and functionality here */}

            <div className="cart-actions mt-6">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Update Cart</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">Remove Items</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">Checkout</button>
            </div>
        </div>
    );
};

export default Cart;