import React, { useState, useEffect } from 'react';
import './App.css';
import OrderList from './OrderList';
import { Order } from './types';

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

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('carWashOrders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Convert timestamp strings back to Date objects
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          timestamp: new Date(order.timestamp)
        }));
        for (let i = 0; i < ordersWithDates.length; i++) {
          orders.push(ordersWithDates[i])
        }
        setOrders(ordersWithDates);
        orders.concat(ordersWithDates)
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('carWashOrders', JSON.stringify(orders));
  }, [orders]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Order = {
      id: orders.length + 1,
      licenseNumber: formData.licenseNumber,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      timestamp: new Date()
    };

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
  };

  const clearAllOrders = () => {
    if (window.confirm('Are you sure you want to clear all orders? This action cannot be undone.')) {
      setOrders([]);
      localStorage.removeItem('carWashOrders');
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
      <OrderList orders={orders} />
    </div>
  );

  return currentPage === 'form' ? renderFormPage() : renderListPage();
}

export default App;
