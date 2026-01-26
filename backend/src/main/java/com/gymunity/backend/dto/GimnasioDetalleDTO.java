package com.gymunity.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO con información detallada de un gimnasio.
 * Se usa en la página de detalle del gimnasio.
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class GimnasioDetalleDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String ciudad;
    private String telefono;
    private String email;
    private String foto;
    private List<String> fotos;
    private List<String> descripcionesFotos;
    private Double valoracionMedia;
    private Integer totalResenias;
    private Integer totalApuntados;
    private List<ClaseDTO> clases;
    private List<ProfesorDTO> profesores;
    private List<TorneoDTO> torneos;
    private List<ReseniaDTO> resenias;
}
