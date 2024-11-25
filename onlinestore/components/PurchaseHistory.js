// components/PurchaseHistory.js

"use client";

export default function PurchaseHistory({ orders }) {
  return (
    <div>
      <h3 className="text-xl mb-4">Purchase History</h3>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <ul>
          {orders.map((order) => {
            // Use totalAmount from the API response
            const totalAmount = order.totalAmount;

            return (
              <li key={order.id} className="mb-4 border p-4">
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Total Amount:</strong> $
                  {typeof totalAmount === "number" && !isNaN(totalAmount)
                    ? totalAmount.toFixed(2)
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {order.status || "Unknown"}
                </p>
                <h4 className="mt-2">Items:</h4>
                {order.productQuantities && order.productQuantities.length > 0 ? (
                  <ul className="ml-4">
                    {order.productQuantities.map((item) => (
                      <li key={item.product.id}>
                        {item.product.name} x {item.quantity} - $
                        {item.product.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in this order.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}