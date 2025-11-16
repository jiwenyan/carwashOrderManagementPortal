import React, { useState, useEffect } from 'react';
import './App.css';
import OrderList from './OrderList';
import { Order } from './types';
import { orderApi } from './api/orderApi';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<'form' | 'list'>('form');
  const [formData, setFormData] = useState({
    licenseNumber: '',
    name: '',
    phoneNumber: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(0);
  const [queuePosition, setQueuePosition] = useState(0);

  // Load orders from backend API on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const isBackendAvailable = await orderApi.checkBackendStatus();
        if (isBackendAvailable) {
          const backendOrders = await orderApi.getAllOrders();
          setOrders(backendOrders);
        } else {
          console.warn('Backend is not available, using empty orders list');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading orders from backend:', error);
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newOrder = await orderApi.createOrder({
        licenseNumber: formData.licenseNumber,
        name: formData.name,
        phoneNumber: formData.phoneNumber
      });

      setOrders(prev => [...prev, newOrder]);
      setTicketNumber(newOrder.id);
      setQueuePosition(orders.length);
      setShowSuccess(true);

      // Reset form
      setFormData({
        licenseNumber: '',
        name: '',
        phoneNumber: ''
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const clearAllOrders = async () => {
    if (window.confirm('Are you sure you want to clear all orders? This action cannot be undone.')) {
      try {
        // Delete all orders from backend
        for (const order of orders) {
          await orderApi.deleteOrder(order.id);
        }
        setOrders([]);
      } catch (error) {
        console.error('Error clearing orders:', error);
        alert('Failed to clear all orders. Please try again.');
      }
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderApi.updateOrderStatus(orderId, 'cancelled');
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const completeOrder = async (orderId: number) => {
    if (window.confirm('Mark this order as completed?')) {
      try {
        await orderApi.updateOrderStatus(orderId, 'completed');
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: 'completed' } : order
        ));
      } catch (error) {
        console.error('Error completing order:', error);
        alert('Failed to complete order. Please try again.');
      }
    }
  };

  const renderFormPage = () => (
    <div className="App">
      <header className="App-header">
        <h1>Car Wash Order Management</h1>
        <p>Submit your car wash order below</p>
        <div className="navigation">
          <button
            className="nav-btn"
            onClick={() => setCurrentPage('list')}
          >
            📋 View Order List ({orders.length})
          </button>
          {orders.length > 0 && (
            <button
              className="nav-btn clear-btn"
              onClick={clearAllOrders}
            >
              🗑️ Clear All Orders
            </button>
          )}
        </div>
      </header>

      <main className="App-main">
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="licenseNumber">Car License Number:</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter license plate number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Order
          </button>
        </form>

        {showSuccess && (
          <div className="success-message">
            <h2>✅ Order Submitted Successfully!</h2>
            <p><strong>Ticket Number:</strong> #{ticketNumber}</p>
            <p><strong>Cars in front of you:</strong> {queuePosition}</p>
            <p>Please wait for your turn. We'll notify you when it's your turn.</p>
          </div>
        )}

        <div className="queue-info">
          <h3>Current Queue Status</h3>
          <p>Total orders in queue: {orders.length}</p>
        </div>
      </main>
    </div>
  );

  const renderListPage = () => (
    <div className="App">
      <header className="App-header">
        <div className="navigation">
          <button
            className="nav-btn"
            onClick={() => setCurrentPage('form')}
          >
            ➕ Add New Order
          </button>
          {orders.length > 0 && (
            <button
              className="nav-btn clear-btn"
              onClick={clearAllOrders}
            >
              🗑️ Clear All Orders
            </button>
          )}
        </div>
      </header>
      <OrderList orders={orders} onCancelOrder={cancelOrder} onCompleteOrder={completeOrder} />
    </div>
  );

  return currentPage === 'form' ? renderFormPage() : renderListPage();
}

export default App;
