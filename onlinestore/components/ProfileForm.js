"use client";

import { useState } from 'react';

export default function ProfileForm({ userData }) {
  const [formData, setFormData] = useState({
    username: userData.username,
    shippingAddress: userData.shippingAddress || {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
    },
    creditCard: userData.creditCard || {
      cardHolder: '',
      cardLast4: '',
      cardType: '',
      expiration: '',
      billingAddress: {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
      },
    },
  });

  const handleChange = (e, section, field, subSection = null) => {
    if (subSection) {
      // Handle nested fields (e.g., billingAddress)
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [subSection]: {
            ...formData[section][subSection],
            [field]: e.target.value,
          },
        },
      });
    } else if (section) {
      // Handle regular nested fields (e.g., shippingAddress, creditCard)
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: e.target.value,
        },
      });
    } else {
      // Handle top-level fields (e.g., username)
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Profile updated successfully.');
        // Optionally, refresh the data
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      {/* Username */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Username</label>
        <input
          type="text"
          name="username"
          className="border px-4 py-2 w-full"
          value={formData.username}
          onChange={(e) => handleChange(e, null, 'username')}
        />
      </div>

      {/* Shipping Address */}
      <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
      {['street', 'city', 'province', 'postalCode', 'country'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-bold mb-1 capitalize">{field}</label>
          <input
            type="text"
            className="border px-4 py-2 w-full"
            value={formData.shippingAddress[field]}
            onChange={(e) => handleChange(e, 'shippingAddress', field)}
          />
        </div>
      ))}

      {/* Credit Card Info */}
      <h3 className="text-lg font-bold mb-2">Credit Card Information</h3>
      {['cardHolder', 'cardLast4', 'cardType', 'expiration'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-bold mb-1 capitalize">{field}</label>
          <input
            type={field === 'expiration' ? 'date' : 'text'}
            className="border px-4 py-2 w-full"
            value={formData.creditCard[field]}
            onChange={(e) => handleChange(e, 'creditCard', field)}
          />
        </div>
      ))}

      {/* Billing Address */}
      <h4 className="text-md font-bold mb-2">Billing Address</h4>
      {['street', 'city', 'province', 'postalCode', 'country'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-bold mb-1 capitalize">{field}</label>
          <input
            type="text"
            className="border px-4 py-2 w-full"
            value={formData.creditCard.billingAddress[field]}
            onChange={(e) => handleChange(e, 'creditCard', field, 'billingAddress')}
          />
        </div>
      ))}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}