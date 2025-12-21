package com.gymunity.backend.dto;

import jakarta.validation.constraints.Size;
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

    @Size(max = 100, message = "El término de búsqueda no puede superar los 100 caracteres")
    private String termino;
    
    @Size(max = 100, message = "La ciudad no puede superar los 100 caracteres")
    private String ciudad;
    
    @Size(max = 50, message = "El arte marcial no puede superar los 50 caracteres")
    private String arteMarcial;
}
