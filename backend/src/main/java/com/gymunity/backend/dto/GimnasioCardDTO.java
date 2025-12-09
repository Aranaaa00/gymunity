package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para mostrar gimnasios en tarjetas (listados).
 * Contiene información resumida para las cards del frontend.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class GimnasioCardDTO {

    private Long id;
    private String nombre;
    private String ciudad;
    private String foto;
    private String disciplinas;
    private Double valoracionMedia;
    private Integer totalResenias;
}
