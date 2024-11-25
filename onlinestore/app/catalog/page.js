// app/catalog/page.js

import prisma from '@/prisma/prisma';
import ProductCard from '/components/ProductCard';
import FilterSortBar from '/components/FilterSortBar';

export default async function Catalog({ searchParams }) {
  const searchParam = await searchParams;
  const category = searchParam.category || '';
  const search = searchParam.search || '';
  const sortField = searchParam.sortField || '';
  const sortOrder = searchParam.sortOrder || 'asc';

  // Fetch distinct categories for the dropdown
  const categoriesResult = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  const categories = categoriesResult
    .map((item) => item.category)
    .filter((category) => category !== null && category !== undefined);

  // Build the query object
  const where = {};
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Sorting
  const orderBy = sortField
    ? { [sortField]: sortOrder }
    : { name: 'asc' };

  // Fetch products from the database
  const products = await prisma.product.findMany({
    where,
    orderBy,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Product Catalog</h1>
      {/* Pass categories to the FilterSortBar*/}
      <FilterSortBar categories={categories} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}