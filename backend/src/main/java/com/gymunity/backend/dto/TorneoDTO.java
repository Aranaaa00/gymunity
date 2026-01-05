package com.gymunity.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para información de torneos.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class TorneoDTO {

    private Long id;
    private String nombre;
    private LocalDate fecha;
    private String disciplina;
}
