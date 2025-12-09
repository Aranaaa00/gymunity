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
public class InteraccionRequestDTO {

    @NotNull(message = "El usuario es obligatorio")
    private Long usuarioId;
    
    @NotNull(message = "El gimnasio es obligatorio")
    private Long gimnasioId;
    
    private String texto;
}
