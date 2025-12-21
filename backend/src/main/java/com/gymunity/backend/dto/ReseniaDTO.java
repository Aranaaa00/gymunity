package com.gymunity.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para mostrar reseñas de usuarios sobre gimnasios.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ReseniaDTO {

    private Long id;
    private String nombreUsuario;
    private String avatarUsuario;
    private String texto;
    private Integer valoracion;
    private LocalDate fecha;
}
