package com.carwash.mgmtportal.controller;

import com.carwash.mgmtportal.model.CarWashOrder;
import com.carwash.mgmtportal.model.OrderStatus;
import com.carwash.mgmtportal.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;


@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/api_status")
    public ResponseEntity<Map> statusCheck(){
        Map<String,String> result = new HashMap<String, String>();
        result.put("status","ok");
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<CarWashOrder>> getAllOrders() {
        List<CarWashOrder> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<CarWashOrder> getOrderById(@PathVariable UUID orderId) {
        CarWashOrder order = orderService.getOrderById(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<CarWashOrder> createOrder(@RequestBody CarWashOrder order) {
        CarWashOrder createdOrder = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<CarWashOrder> updateOrder(@PathVariable UUID orderId, @RequestBody CarWashOrder order) {
        CarWashOrder updatedOrder = orderService.updateOrder(orderId, order);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<CarWashOrder> updateOrderStatus(@PathVariable UUID orderId, @RequestBody OrderStatusRequest statusRequest) {
        CarWashOrder updatedOrder = orderService.updateOrderStatus(orderId, statusRequest.getStatus());
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID orderId) {
        CarWashOrder order = orderService.getOrderById(orderId);
        if (order != null) {
            orderService.deleteOrder(orderId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CarWashOrder>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<CarWashOrder> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // Request DTO for status updates
    public static class OrderStatusRequest {
        private OrderStatus status;

        public OrderStatus getStatus() {
            return status;
        }

        public void setStatus(OrderStatus status) {
            this.status = status;
        }
    }
}