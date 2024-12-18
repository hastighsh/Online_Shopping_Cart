'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/util/apiClient';
import styles from './Products.module.css';
import Link from 'next/link';

export default function AddProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '', // Image is now a Base64 string, not a file object
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
  
    if (formData.image) {
      formDataToSend.append('image', formData.image); // This sends the Base64 string
    }
  
    try {
      const response = await fetch('/api/admin/add-product', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit product');
      }
  
      setFormData({ name: '', description: '', price: '', category: '', image: '' });
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error submitting product:', error);
      alert(error.message);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files && files[0]) {
      // Convert the image to Base64
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Store Base64 string
      };
      reader.readAsDataURL(file); // Read file as Base64
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        console.log(fileReader.result); // Debugging - log the preview data
      };
      fileReader.readAsDataURL(file);
    }
  };

  async function fetchProducts() {
    try {
      const response = await apiFetch('/api/admin/products');
      if (!response.ok) throw new Error('Failed to fetch products');

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setProducts(data);

      const uniqueCategories = [...new Set(data.map((product) => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Fetch products error:', error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Add a New Product to Inventory</h1>
      <form onSubmit={handleSubmit}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  name="name"
                  className="border rounded w-full px-2 py-1"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border rounded w-full px-2 py-1"
                  placeholder="Description"
                  required
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  className="border rounded w-full px-2 py-1"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0.00"
                  required
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  name="category"
                  className="border rounded w-full px-2 py-1"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </td>
              
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <input
            type="file"
            className="border rounded w-full px-2 py-1"
            accept="image/*"
            name="image"
            onChange={(e) => {
              handleChange(e); // Update the form data
              handleImagePreview(e); // Preview image (optional)
            }}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      <hr className="border-t-2 border-gray-300 mt-4" />
      <div className="flex justify-center mt-4">
      <h2>Modify/add product quantity at <b><Link href="/admin/products">Product Management</Link> </b></h2>
      </div>
    </div>
  );
}
