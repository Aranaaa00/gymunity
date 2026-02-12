package com.gymunity.backend.security;

import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para validar la seguridad JWT.
 * Valida login, logout, autorización por roles y CORS.
 */
@SpringBootTest
@AutoConfigureMockMvc
class JwtSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockitoBean
    private UsuarioService usuarioService;
    
    @BeforeEach
    void setUp() {
        // Mock de usuario para tests con @WithMockUser
        Usuario mockUsuario = new Usuario();
        mockUsuario.setId(1L);
        mockUsuario.setEmail("test@test.com");
        mockUsuario.setNombreUsuario("testuser");
        mockUsuario.setRol(Rol.ALUMNO);
        
        when(usuarioService.buscarPorEmail(anyString())).thenReturn(mockUsuario);
    }
    
    /**
     * Test: Acceso sin autenticación a endpoint protegido debe retornar 403 (Forbidden con CSRF).
     */
    @Test
    void acceso_SinToken_Retorna403() throws Exception {
        mockMvc.perform(post("/api/gimnasios")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Test\",\"descripcion\":\"Test\",\"ciudad\":\"Madrid\"}"))
                .andExpect(status().isForbidden());
    }
    
    /**
     * Test: Acceso con autenticación debe permitir acceso.
     */
    @Test
    @WithMockUser(username = "test@test.com", roles = "ALUMNO")
    void acceso_ConAutenticacion_PermiteAcceso() throws Exception {
        mockMvc.perform(get("/api/gimnasios"))
                .andExpect(status().isOk());
    }
    
    /**
     * Test: Endpoint restringido a ADMIN debe rechazar a ALUMNO.
     */
    @Test
    @WithMockUser(username = "alumno@test.com", roles = "ALUMNO")
    void acceso_AlumnoAEndpointAdmin_Retorna403() throws Exception {
        mockMvc.perform(post("/api/gimnasios")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Test\",\"ciudad\":\"Madrid\"}"))
                .andExpect(status().isForbidden());
    }
    
    /**
     * Test: Endpoint restringido a PROFESOR debe permitir acceso a PROFESOR.
     */
    @Test
    @WithMockUser(username = "profesor@test.com", roles = "PROFESOR")
    void acceso_ProfesorAEndpointProfesor_PermiteAcceso() throws Exception {
        mockMvc.perform(post("/api/gimnasios")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Test\",\"descripcion\":\"Test\",\"ciudad\":\"Madrid\"}"))
                .andExpect(status().isCreated()); // POST retorna 201 CREATED
    }
    
    /**
     * Test: Login sin credenciales debe retornar 400 (validación).
     */
    @Test
    void login_SinCredenciales_Retorna400() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
    
    /**
     * Test: CORS preflight (OPTIONS) debe retornar 200.
     */
    @Test
    void cors_PreflightRequest_Retorna200() throws Exception {
        mockMvc.perform(options("/api/gimnasios")
                        .header("Origin", "http://localhost:4200")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
    
    /**
     * Test: Logout sin token debe retornar 400.
     */
    @Test
    @WithMockUser
    void logout_SinToken_Retorna400() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("No se encontró token para cerrar sesión"));
    }
    
    /**
     * Test: Validate endpoint requiere autenticación.
     */
    @Test
    void validate_SinAutenticacion_Retorna401() throws Exception {
        mockMvc.perform(get("/api/auth/validate"))
                .andExpect(status().isUnauthorized());
    }
    
    /**
     * Test: Validate endpoint con autenticación retorna 200.
     */
    @Test
    @WithMockUser(username = "test@test.com", roles = "ALUMNO")
    void validate_ConAutenticacion_Retorna200() throws Exception {
        mockMvc.perform(get("/api/auth/validate"))
                .andExpect(status().isOk());
    }
}
