package com.gymunity.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class InscripcionRequestDTO {

    @NotNull(message = "El alumno es obligatorio")
    private Long alumnoId;
    
    @NotNull(message = "La clase es obligatoria")
    private Long claseId;
}
