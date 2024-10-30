import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
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
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}