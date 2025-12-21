package com.gymunity.backend.swagger;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para Swagger/OpenAPI.
 * Valida que la documentación de la API está correctamente configurada y accesible.
 */
@SpringBootTest
@AutoConfigureMockMvc
class SwaggerEndpointsTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Test: Swagger UI debe ser accesible.
     */
    @Test
    void swaggerUI_EndpointAccesible_RetornaRedireccion() throws Exception {
        mockMvc.perform(get("/swagger-ui.html"))
                .andExpect(status().is3xxRedirection());
    }

    /**
     * Test: Swagger UI index debe ser accesible.
     */
    @Test
    void swaggerUI_Index_EsAccesible() throws Exception {
        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/html"));
    }
}

