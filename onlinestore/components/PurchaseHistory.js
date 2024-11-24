"use client";

export default function PurchaseHistory({ orders }) {
  return (
    <div>
      <h3 className="text-xl mb-4">Purchase History</h3>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-4 border p-4">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <h4 className="mt-2">Items:</h4>
              <ul className="ml-4">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} x {item.quantity} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}