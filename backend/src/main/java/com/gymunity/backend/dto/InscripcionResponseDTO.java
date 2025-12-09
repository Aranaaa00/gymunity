package com.gymunity.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class InscripcionResponseDTO {

    private Long id;
    private Long alumnoId;
    private String nombreAlumno;
    private Long claseId;
    private String nombreClase;
    private LocalDate fechaInscripcion;
}
