package com.gymunity.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para la actualización parcial de usuarios.
 * Todos los campos son opcionales.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UsuarioActualizacionDTO {

    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    private String nombreUsuario;

    @Email(message = "El email no es válido")
    private String email;

    @Size(max = 100, message = "La ciudad debe tener máximo 100 caracteres")
    private String ciudad;

    private String avatar;
}
