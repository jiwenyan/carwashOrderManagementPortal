package com.carwash.mgmtportal.service;

import com.carwash.mgmtportal.model.CarWashOrder;
import com.carwash.mgmtportal.model.OrderStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OrderServiceImpl implements OrderService {

    private final Map<UUID, CarWashOrder> orders = new ConcurrentHashMap<>();

    @Override
    public List<CarWashOrder> getAllOrders() {
        return new ArrayList<>(orders.values());
    }

    @Override
    public CarWashOrder getOrderById(UUID orderId) {
        return orders.get(orderId);
    }

    @Override
    public CarWashOrder createOrder(CarWashOrder order) {
        if (order.getOrderId() == null) {
            order.setOrderId(UUID.randomUUID());
        }
        orders.put(order.getOrderId(), order);
        return order;
    }

    @Override
    public CarWashOrder updateOrder(UUID orderId, CarWashOrder updatedOrder) {
        CarWashOrder existingOrder = orders.get(orderId);
        if (existingOrder != null) {
            existingOrder.setUserName(updatedOrder.getUserName());
            existingOrder.setPhoneNumber(updatedOrder.getPhoneNumber());
            existingOrder.setCarLicenseNumber(updatedOrder.getCarLicenseNumber());
            existingOrder.setOrderStatus(updatedOrder.getOrderStatus());
            return existingOrder;
        }
        return null;
    }

    @Override
    public CarWashOrder updateOrderStatus(UUID orderId, OrderStatus status) {
        CarWashOrder order = orders.get(orderId);
        if (order != null) {
            order.setOrderStatus(status);
            return order;
        }
        return null;
    }

    @Override
    public void deleteOrder(UUID orderId) {
        orders.remove(orderId);
    }

    @Override
    public List<CarWashOrder> getOrdersByStatus(OrderStatus status) {
        return orders.values().stream()
                .filter(order -> order.getOrderStatus() == status)
                .toList();
    }
}