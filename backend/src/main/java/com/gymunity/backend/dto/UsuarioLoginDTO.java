package com.gymunity.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    @Size(max = 100, message = "El email o nombre de usuario no puede superar los 100 caracteres")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(max = 100, message = "La contraseña no puede superar los 100 caracteres")
    private String contrasenia;
}
