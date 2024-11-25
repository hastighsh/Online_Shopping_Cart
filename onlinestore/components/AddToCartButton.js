// components/AddToCartButton.js

'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert('Item added to cart!');
  };

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
}