'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';
import Image from 'next/image';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    calculateTotal,
  } = useContext(CartContext);
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/catalog');
  };

  const handleCheckout = () => {
    // If the cart is empty, prevent checkout
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add items before proceeding to checkout.');
      return;
    }

    // Navigate to the checkout page
    router.push('/checkout');
  };

  return (
    <div className="cart-container p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">
          Your shopping cart is currently empty.
        </p>
      ) : (
        <div>
          <div className="cart-items mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="cart-item flex justify-between items-center border-b py-4"
              >
                <div className="flex items-center flex-grow">
                  <div className="w-16 h-16 relative mr-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="quantity-control flex items-center">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(item.quantity - 1, 1))
                    }
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
                    onClick={() => removeFromCart(item.id)}
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
              onClick={handleCheckout}
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