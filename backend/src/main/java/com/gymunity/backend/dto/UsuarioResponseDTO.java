package com.gymunity.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta con información del usuario (sin datos sensibles).
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UsuarioResponseDTO {

    private Long id;
    private String nombreUsuario;
    private String email;
    private String rol;
    private LocalDate fechaRegistro;
    private String avatar;
    private String ciudad;
}
