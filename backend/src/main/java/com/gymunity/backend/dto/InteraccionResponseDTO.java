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
public class InteraccionResponseDTO {

    private Long id;
    private Long usuarioId;
    private String nombreUsuario;
    private Long gimnasioId;
    private String nombreGimnasio;
    private Boolean esApuntado;
    private String resenia;
    private Integer valoracion;
    private LocalDate fechaInteraccion;
}
