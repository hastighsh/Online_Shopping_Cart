// app/api/add-product/route.js

import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get form data
    const formData = await request.formData();

    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const category = formData.get('category');
    const image = formData.get('image'); // This will be the Base64 string or a file

    console.log('Received data:', { name, description, price, category, image });

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate price is a valid number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: 'Price must be a valid number' },
        { status: 400 }
      );
    }

    // Check if image is a file or Base64 string
    let imageData = image;
    if (image && image.startsWith('data:image/')) {
      // It's a Base64 string
      imageData = image;
    } else if (image instanceof File) {
      // If it's a file, you can save it or process it as needed
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        // Process the base64 image here or store it
        console.log('Processed base64 image:', base64Image);
      };
      reader.readAsDataURL(image);
    }

    // Create the new product in the database
    const newProduct = await prisma.Product.create({
      data: {
        name,
        description,
        price: parsedPrice, // Ensure price is a valid number
        category,
        image: imageData, // Store Base64 image string
      },
    });

    // Log the created product to debug
    console.log('Product created:', newProduct);

    // Return a success response
    return NextResponse.json(
      { message: 'Product added successfully', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);

    // Return an appropriate error message
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
