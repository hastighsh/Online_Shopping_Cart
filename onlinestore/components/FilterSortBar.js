// components/FilterSortBar.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterSortBar({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sortField: searchParams.get('sortField') || '',
    sortOrder: searchParams.get('sortOrder') || '',
  });

  useEffect(() => {
    // Update filters when the URL query changes
    setFilters({
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      sortField: searchParams.get('sortField') || '',
      sortOrder: searchParams.get('sortOrder') || '',
    });
  }, [searchParams]);

  function handleInputChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function applyFilters() {
    const params = new URLSearchParams(filters);
    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleInputChange}
        placeholder="Search..."
        className="border p-2 rounded"
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleInputChange}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        {Array.isArray(categories) &&
          categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
      </select>
      <select
        name="sortField"
        value={filters.sortField}
        onChange={handleInputChange}
        className="border p-2 rounded"
      >
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <select
        name="sortOrder"
        value={filters.sortOrder}
        onChange={handleInputChange}
        className="border p-2 rounded"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button
        onClick={applyFilters}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Apply
      </button>
    </div>
  );
}