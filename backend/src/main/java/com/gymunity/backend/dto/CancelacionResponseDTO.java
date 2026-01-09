package com.gymunity.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CancelacionResponseDTO {

    private boolean reembolso;
    private String mensaje;
}
