// app/product/[id]/page.js

import prisma from '@/prisma/prisma';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductDetails({ params }) {
  const productId = parseInt(params.id);

  // Fetch product details
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Product Not Found
        </h1>
      </div>
    );
  }

  // Calculate quantity remaining
  const quantityRemaining = await prisma.productItem.count({
    where: {
      productId: productId,
      orderId: null, // ProductItems not associated with any order
    },
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row gap-6">
      {/* Product Image */}
      <div className="relative w-full md:w-1/2">
        <Image
          src={product.image}
          alt={product.name}
          layout="responsive"  // Responsive scaling of image
          width={600}  
          height={600}  
        />
      </div>
        {/* ProductDetails*/}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">{product.description}</p>
          <p className="mb-4">
            <strong>Category:</strong> {product.category || 'N/A'}
          </p>
          <p className="mb-4">
            <strong>Quantity Remaining:</strong>{' '}
            {quantityRemaining > 0 ? quantityRemaining : 'Out of Stock'}
          </p>
          {/* Add to Cart Button */}
          {quantityRemaining > 0 ? (
            <AddToCartButton product={product} />
          ) : (
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
              disabled
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}