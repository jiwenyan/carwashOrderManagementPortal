package com.carwash.mgmtportal.service;

import com.carwash.mgmtportal.model.CarWashOrder;
import com.carwash.mgmtportal.model.OrderStatus;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    List<CarWashOrder> getAllOrders();

    CarWashOrder getOrderById(UUID orderId);

    CarWashOrder createOrder(CarWashOrder order);

    CarWashOrder updateOrder(UUID orderId, CarWashOrder order);

    CarWashOrder updateOrderStatus(UUID orderId, OrderStatus status);

    void deleteOrder(UUID orderId);

    List<CarWashOrder> getOrdersByStatus(OrderStatus status);
}