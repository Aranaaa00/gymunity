package com.gymunity.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para el inicio de sesión de usuarios.
 * Acepta email o nombre de usuario como identificador.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UsuarioLoginDTO {

    @NotBlank(message = "El email o nombre de usuario es obligatorio")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasenia;
}
