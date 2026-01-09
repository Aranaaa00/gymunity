package com.gymunity.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private String alumnoNombre;
    private Long claseId;
    private Long gimnasioId;
    private String claseNombre;
    private String gimnasioNombre;
    private String profesorNombre;
    private LocalDate fechaInscripcion;
    private LocalDateTime fechaClase;
    private boolean puedeReembolsar;
}
