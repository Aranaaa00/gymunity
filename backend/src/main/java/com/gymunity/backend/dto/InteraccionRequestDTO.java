package com.gymunity.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class InteraccionRequestDTO {

    @NotNull(message = "El usuario es obligatorio")
    private Long usuarioId;
    
    @NotNull(message = "El gimnasio es obligatorio")
    private Long gimnasioId;
    
    @Size(max = 1000, message = "La reseña no puede superar los 1000 caracteres")
    private String texto;
    
    @Min(value = 1, message = "La valoración mínima es 1 estrella")
    @Max(value = 5, message = "La valoración máxima es 5 estrellas")
    private Integer valoracion;
}
