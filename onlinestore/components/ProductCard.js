// components/ProductCard.js

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartContext } from '@/context/CartContext';
import { useContext } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert('Item added to cart!');
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full h-48 cursor-pointer">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <h2 className="text-lg font-semibold">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h2>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}