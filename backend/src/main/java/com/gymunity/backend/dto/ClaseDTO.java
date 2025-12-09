package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para información de clases/artes marciales.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ClaseDTO {

    private Long id;
    private String nombre;
    private String icono;
    private String nombreProfesor;
    private Integer totalAlumnos;
}
