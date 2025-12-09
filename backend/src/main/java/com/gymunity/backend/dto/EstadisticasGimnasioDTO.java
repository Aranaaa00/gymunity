package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class EstadisticasGimnasioDTO {

    private long apuntados;
    private long resenias;
}
