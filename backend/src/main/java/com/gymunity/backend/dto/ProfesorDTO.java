package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para información de profesores.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ProfesorDTO {

    private Long id;
    private String nombre;
    private String especialidad;
    private String foto;
    private Double valoracion;
}
