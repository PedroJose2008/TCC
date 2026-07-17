package br.com.homeoffice.HomeOffice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

/**
 *
 * Spring Boot application starter class
 */
@SpringBootApplication
@EntityScan("br.com.homeoffice.HomeOffice.entity")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

//aplicação
