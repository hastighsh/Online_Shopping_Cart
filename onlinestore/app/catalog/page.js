import products from '/data/products';
import ProductCard from '/components/ProductCard';

export default function Catalog() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Product Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}