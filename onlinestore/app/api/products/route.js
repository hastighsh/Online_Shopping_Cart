//NEVERMIND I DONT THINK WE NEED TO USE THIS. Thought that product filtering would have to be backend.
//It's not. Can delete if everything works through testing.

// app/api/products/route.js

import prisma from '@/prisma/prisma'; 
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sortField');
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build the query object
    const where = {};

    // Filtering
    if (category) {
      where.category = category;
    }

    if (genre) {
      where.genre = genre;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        // Add other fields??
      ];
    }

    // Sorting
    const orderBy = sortField
      ? { [sortField]: sortOrder }
      : { name: 'asc' }; // Default sort by name ascending

    // Fetch products from the database
    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}