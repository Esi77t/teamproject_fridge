package com.fridge.demo.dto.request;

import lombok.Getter;

@Getter
public class CreateItemRequest {
    private String name;
    private int quantity;
    private String unit;
    private String category;
    private String icon;
}