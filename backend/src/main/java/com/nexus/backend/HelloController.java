package com.nexus.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // makes the class handle HTTP requests and return response data
public class HelloController {
    @GetMapping("/api/hello")
    public String hello() {
        return "Hellow hellow";
    }
}
