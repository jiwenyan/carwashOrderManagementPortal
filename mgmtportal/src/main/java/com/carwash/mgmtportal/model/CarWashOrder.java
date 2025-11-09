package com.carwash.mgmtportal.model;

import java.util.UUID;

public class CarWashOrder {
    private UUID orderId;
    private String userName;
    private String phoneNumber;
    private String carLicenseNumber;
    private OrderStatus orderStatus;

    public CarWashOrder() {
        this.orderId = UUID.randomUUID();
        this.orderStatus = OrderStatus.PENDING;
    }

    public CarWashOrder(String userName, String phoneNumber, String carLicenseNumber) {
        this();
        this.userName = userName;
        this.phoneNumber = phoneNumber;
        this.carLicenseNumber = carLicenseNumber;
    }

    // Getters and Setters
    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCarLicenseNumber() {
        return carLicenseNumber;
    }

    public void setCarLicenseNumber(String carLicenseNumber) {
        this.carLicenseNumber = carLicenseNumber;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }
}