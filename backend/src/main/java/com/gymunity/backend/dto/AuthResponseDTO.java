package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de autenticación exitosa.
 * Contiene el token JWT y la información básica del usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    
    private String token;
    private String email;
    private String nombreUsuario;
    private String rol;
    private Long id;
    private String mensaje;
}
