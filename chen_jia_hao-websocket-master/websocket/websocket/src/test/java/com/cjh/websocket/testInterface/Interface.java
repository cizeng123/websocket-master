package com.cjh.websocket.testInterface;

import org.springframework.web.client.RestTemplate;

public class Interface {
    public static void main (String[] args){
        String url = "http://192.168.1.188:8181/Interface/other/user?userID=201804190000001";
        RestTemplate restTemplate=new RestTemplate();
        String result = restTemplate.getForObject(url, String.class);
        System.out.println(result);
    }
}
