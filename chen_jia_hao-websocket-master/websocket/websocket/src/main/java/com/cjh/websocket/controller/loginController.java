package com.cjh.websocket.controller;

import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class loginController {
    @RequestMapping(value = "/tologin")
    public String login(HttpServletRequest request, Model model, HttpSession session){
        String account = request.getParameter("username");
        String password = request.getParameter("password");
        model.addAttribute("username",account);

        session.setAttribute("account",account);
        return "index";
    }

    @RequestMapping(value = "/restTemplate")
    @ResponseBody
    public String restTemplate(){
        String url = "http://192.168.1.188:8181/Interface/other/user?userID=201804190000001";
        RestTemplate restTemplate=new RestTemplate();
        String result = restTemplate.getForObject(url, String.class);
        System.out.println(result);

        return result;
    }
}
