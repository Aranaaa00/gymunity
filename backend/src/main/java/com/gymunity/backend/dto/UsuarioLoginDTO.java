package com.gymunity.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para el inicio de sesión de usuarios.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UsuarioLoginDTO {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasenia;
}
