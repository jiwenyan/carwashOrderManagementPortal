import { Order } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Interface to match backend CarWashOrder model
export interface BackendOrder {
  orderId: string;
  userName: string;
  phoneNumber: string;
  carLicenseNumber: string;
  orderStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// Convert frontend Order to backend format (not currently used)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toBackendOrder = (order: Order): Omit<BackendOrder, 'orderId'> => ({
  userName: order.name,
  phoneNumber: order.phoneNumber,
  carLicenseNumber: order.licenseNumber,
  orderStatus: order.status === 'pending' ? 'PENDING' :
               order.status === 'completed' ? 'COMPLETED' : 'CANCELLED'
});

// Convert backend order to frontend format
const toFrontendOrder = (backendOrder: BackendOrder): Order => ({
  id: parseInt(backendOrder.orderId.replace(/[^\d]/g, '').slice(-6), 10) || Date.now(),
  licenseNumber: backendOrder.carLicenseNumber,
  name: backendOrder.userName,
  phoneNumber: backendOrder.phoneNumber,
  timestamp: new Date(), // Backend doesn't have timestamp, use current time
  status: backendOrder.orderStatus === 'PENDING' ? 'pending' :
          backendOrder.orderStatus === 'COMPLETED' ? 'completed' : 'cancelled'
});

export const orderApi = {
  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const backendOrders: BackendOrder[] = await response.json();
      return backendOrders.map(toFrontendOrder);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Create new order
  async createOrder(orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Promise<Order> {
    try {
      const backendOrderData = {
        userName: orderData.name,
        phoneNumber: orderData.phoneNumber,
        carLicenseNumber: orderData.licenseNumber,
        orderStatus: 'PENDING' as const
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendOrderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status}`);
      }

      const createdBackendOrder: BackendOrder = await response.json();
      return toFrontendOrder(createdBackendOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: number, status: 'pending' | 'completed' | 'cancelled'): Promise<Order> {
    try {
      // Since we don't have the actual UUID from backend, we'll need to handle this differently
      // For now, we'll get all orders and find the matching one by our generated ID
      const allOrders = await this.getAllOrders();
      const frontendOrder = allOrders.find(order => order.id === orderId);

      if (!frontendOrder) {
        throw new Error(`Order with ID ${orderId} not found`);
      }

      // Convert frontend status to backend status
      const backendStatus = status === 'pending' ? 'PENDING' :
                           status === 'completed' ? 'COMPLETED' : 'CANCELLED';

      // We need the actual backend orderId (UUID) to make the API call
      // This is a limitation with the current approach - we need to store backend IDs
      const backendOrders: BackendOrder[] = await (await fetch(`${API_BASE_URL}/orders`)).json();
      const backendOrder = backendOrders.find(bo =>
        bo.carLicenseNumber === frontendOrder.licenseNumber &&
        bo.userName === frontendOrder.name &&
        bo.phoneNumber === frontendOrder.phoneNumber
      );

      if (!backendOrder) {
        throw new Error(`Backend order not found for frontend order ${orderId}`);
      }

      const response = await fetch(`${API_BASE_URL}/orders/${backendOrder.orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: backendStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`);
      }

      const updatedBackendOrder: BackendOrder = await response.json();
      return toFrontendOrder(updatedBackendOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(orderId: number): Promise<void> {
    try {
      // Similar to update, we need to find the backend order ID
      const allOrders = await this.getAllOrders();
      const frontendOrder = allOrders.find(order => order.id === orderId);

      if (!frontendOrder) {
        throw new Error(`Order with ID ${orderId} not found`);
      }

      const backendOrders: BackendOrder[] = await (await fetch(`${API_BASE_URL}/orders`)).json();
      const backendOrder = backendOrders.find(bo =>
        bo.carLicenseNumber === frontendOrder.licenseNumber &&
        bo.userName === frontendOrder.name &&
        bo.phoneNumber === frontendOrder.phoneNumber
      );

      if (!backendOrder) {
        throw new Error(`Backend order not found for frontend order ${orderId}`);
      }

      const response = await fetch(`${API_BASE_URL}/orders/${backendOrder.orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete order: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Check if backend is available
  async checkBackendStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/api_status`);
      return response.ok;
    } catch (error) {
      console.error('Backend is not available:', error);
      return false;
    }
  }
};