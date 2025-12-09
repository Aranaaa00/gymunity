package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para parámetros de búsqueda de gimnasios.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class BusquedaDTO {

    private String termino;
    private String ciudad;
    private String arteMarcial;
}
