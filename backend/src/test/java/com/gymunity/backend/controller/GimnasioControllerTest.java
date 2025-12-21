package com.gymunity.backend.controller;

import com.gymunity.backend.security.JwtAuthenticationFilter;
import com.gymunity.backend.security.JwtUtil;
import com.gymunity.backend.service.GimnasioService;
import com.gymunity.backend.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test de integración básico para verificar la seguridad del controlador.
 * Valida que los endpoints requieren autenticación.
 */
@WebMvcTest(GimnasioController.class)
class GimnasioControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private GimnasioService gimnasioService;
    
    @MockBean
    private JwtUtil jwtUtil;
    
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @MockBean
    private UsuarioService usuarioService;
    
    @Test
    void buscar_SinAutenticacion_Retorna401() throws Exception {
        mockMvc.perform(get("/api/gimnasios"))
                .andExpect(status().isUnauthorized());
    }
    
    @Test
    @WithMockUser
    void buscar_ConAutenticacion_PermiteAcceso() throws Exception {
        mockMvc.perform(get("/api/gimnasios"))
                .andExpect(status().isOk());
    }
}
