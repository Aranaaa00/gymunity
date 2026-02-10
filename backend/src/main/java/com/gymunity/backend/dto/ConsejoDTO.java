package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ConsejoDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private String categoria;
    private String icono;
}