// components/CheckoutForm.js

'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';

export default function CheckoutForm({ cartItems, userData }) {
  const [billingInfo, setBillingInfo] = useState({
    cardHolder: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
    cardLast4: '', 
  });
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
  });
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
  });

  const { clearCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      // Pre-fill billing and shipping addresses if user data is available
      if (userData.shippingAddress) {
        setShippingAddress(userData.shippingAddress);
        setBillingAddress(userData.shippingAddress); // Default both to the same initially
      }
      if (userData.creditCard) {
        setBillingInfo({
          cardHolder: userData.creditCard.cardHolder,
          cardNumber: '', // For security, don't pre-fill the full card number
          expiration: userData.creditCard.expiration.slice(0, 7), // Format 'YYYY-MM'
          cvv: '',
          cardLast4: userData.creditCard.cardLast4, // Store last 4 digits
        });
      }
    }
  }, [userData]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
  
    try {
      // Validate inventory levels
      const validationResponse = await fetch('/api/order/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });
      const validationResult = await validationResponse.json();
  
      if (!validationResponse.ok) {
        alert(validationResult.error || 'Order validation failed.');
        setIsProcessing(false);
        return;
      }
  
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
  
      if (!token) {
        alert('You are not logged in. Please log in to place an order.');
        router.push('/login');
        return;
      }
  
      // Simulate payment processing
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include necessary payment info if needed
      });
      const paymentResult = await paymentResponse.json();
  
      if (paymentResult.status === 'accepted') {
        // Proceed to place the order
        const { id: billingId, ...billingAddressData } = billingAddress;
        const { id: shippingId, ...shippingAddressData } = shippingAddress;
      
        const orderPayload = {
          cartItems,
          billingInfo,
          billingAddress: billingAddressData,
          shippingAddress: useSameAddress ? billingAddressData : shippingAddressData,
        };
  
        const orderResponse = await fetch('/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify(orderPayload),
        });
  
        const orderResult = await orderResponse.json();
        if (orderResponse.ok) {
          // Clear cart and navigate to order summary
          sessionStorage.setItem('cardLast4', billingInfo.cardLast4)
          clearCart();
          router.push(`/order-summary/${orderResult.orderId}`);
        } else {
          alert(orderResult.error || 'Failed to place order.');
        }
      } else {
        // Payment was rejected
        const retry = confirm(
          `${paymentResult.error}\nWould you like to try again?`
        );
        if (!retry) {
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="mb-2">
            {item.name} x {item.quantity} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="font-bold mt-2">
        Total: $
        {cartItems
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
          .toFixed(2)}
      </p>

      <h2 className="text-xl font-bold my-4">Billing Information</h2>
      <div className="mb-4">
        <label className="block font-bold mb-1">Card Holder Name</label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={billingInfo.cardHolder}
          onChange={(e) =>
            setBillingInfo({ ...billingInfo, cardHolder: e.target.value })
          }
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">Card Number</label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={
            billingInfo.cardNumber ||
            (billingInfo.cardLast4 ? `${billingInfo.cardLast4}` : '')
          }
          placeholder="Enter card number"
          onChange={(e) =>
            setBillingInfo({
              ...billingInfo,
              cardNumber: e.target.value,
              cardLast4: e.target.value.slice(-4),
            })
          }
          onFocus={(e) => {
            if (billingInfo.cardNumber.startsWith('****')) {
              setBillingInfo({ ...billingInfo, cardNumber: '' });
            }
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">Expiration Date</label>
        <input
          type="month"
          className="border px-4 py-2 w-full"
          value={billingInfo.expiration}
          onChange={(e) =>
            setBillingInfo({ ...billingInfo, expiration: e.target.value })
          }
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">CVV</label>
        <input
          type="text"
          className="border px-4 py-2 w-full"
          value={billingInfo.cvv}
          onChange={(e) => setBillingInfo({ ...billingInfo, cvv: e.target.value })}
        />
      </div>

      <h3 className="text-lg font-bold mb-2">Billing Address</h3>
      {['street', 'city', 'province', 'postalCode', 'country'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-bold mb-1 capitalize">{field}</label>
          <input
            type="text"
            className="border px-4 py-2 w-full"
            value={billingAddress[field]}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, [field]: e.target.value })
            }
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block font-bold mb-1">
          <input
            type="checkbox"
            checked={useSameAddress}
            onChange={() => setUseSameAddress(!useSameAddress)}
          />{' '}
          Shipping address is the same as billing address
        </label>
      </div>

      {!useSameAddress && (
        <>
          <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
          {['street', 'city', 'province', 'postalCode', 'country'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block font-bold mb-1 capitalize">{field}</label>
              <input
                type="text"
                className="border px-4 py-2 w-full"
                value={shippingAddress[field]}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    [field]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </>
      )}

<button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={handlePlaceOrder}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}