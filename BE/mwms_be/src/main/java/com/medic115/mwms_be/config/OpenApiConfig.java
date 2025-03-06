package com.medic115.mwms_be.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                title = "MWMS",
                version = "1.0",
                description = "API for dev MWMS"
        ),
        servers = {
                @Server(
                        description = "localhost",
                        url = "http://localhost:8080/"
                )
        }
)
public class OpenApiConfig {
}
