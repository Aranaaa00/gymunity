package com.gymunity.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class ClaseRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotNull(message = "El gimnasio es obligatorio")
    private Long gimnasioId;
    
    private Long profesorId;
    
    private String icono;
}
