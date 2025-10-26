import React from 'react';
import { Order } from './types';

interface OrderListProps {
  orders: Order[];
  onCancelOrder?: (orderId: number) => void;
  onCompleteOrder?: (orderId: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onCancelOrder, onCompleteOrder }) => {
  return (
    <div className="order-list">
      <header className="order-list-header">
        <h1>Car Wash Orders</h1>
        <p>Current queue: {orders.length} orders</p>
      </header>

      <main className="order-list-main">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders in queue</h2>
            <p>All orders have been processed.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order, index) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Ticket #{order.id}</h3>
                  <span className="queue-position">Position: {index + 1}</span>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <strong>License Plate:</strong>
                    <span>{order.licenseNumber}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Customer:</strong>
                    <span>{order.name}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong>
                    <span>{order.phoneNumber}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Submitted:</strong>
                    <span>{order.timestamp.toLocaleString()}</span>
                  </div>
                </div>

                <div className="order-status">
                  <span className={`status-${order.status}`}>
                    {order.status === 'pending' && '⏳ Waiting'}
                    {order.status === 'completed' && '✅ Completed'}
                    {order.status === 'cancelled' && '❌ Cancelled'}
                  </span>
                  <span className="wait-time">
                    {order.status === 'pending' &&
                      (index === 0 ? 'Currently being processed' : `${index} cars ahead`)
                    }
                    {order.status === 'completed' && 'Order completed'}
                    {order.status === 'cancelled' && 'Order cancelled'}
                  </span>
                </div>

                {order.status === 'pending' && (onCancelOrder || onCompleteOrder) && (
                  <div className="order-actions">
                    {onCompleteOrder && (
                      <button
                        className="complete-btn"
                        onClick={() => onCompleteOrder(order.id)}
                      >
                        ✅ Mark as Completed
                      </button>
                    )}
                    {onCancelOrder && (
                      <button
                        className="cancel-btn"
                        onClick={() => onCancelOrder(order.id)}
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderList;