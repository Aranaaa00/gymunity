package com.gymunity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gymunity.backend.dto.EstadisticasGimnasioDTO;
import com.gymunity.backend.dto.InteraccionRequestDTO;
import com.gymunity.backend.dto.InteraccionResponseDTO;
import com.gymunity.backend.dto.ReseniaDTO;
import com.gymunity.backend.service.InteraccionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interacciones")
@RequiredArgsConstructor
public class InteraccionController {

    private final InteraccionService interaccionService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<InteraccionResponseDTO>> obtenerInteraccionesUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(interaccionService.obtenerInteraccionesDeUsuario(usuarioId));
    }

    @GetMapping("/gimnasio/{gimnasioId}/resenias")
    public ResponseEntity<List<ReseniaDTO>> obtenerResenias(@PathVariable Long gimnasioId) {
        return ResponseEntity.ok(interaccionService.obtenerReseniasDeGimnasio(gimnasioId));
    }

    @PostMapping("/apuntarse")
    public ResponseEntity<InteraccionResponseDTO> apuntarse(@Valid @RequestBody InteraccionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(interaccionService.apuntarse(dto.getUsuarioId(), dto.getGimnasioId()));
    }

    @DeleteMapping("/usuario/{usuarioId}/gimnasio/{gimnasioId}")
    public ResponseEntity<Void> desapuntarse(
            @PathVariable Long usuarioId,
            @PathVariable Long gimnasioId) {
        interaccionService.desapuntarse(usuarioId, gimnasioId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resenia")
    public ResponseEntity<InteraccionResponseDTO> dejarResenia(@Valid @RequestBody InteraccionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(interaccionService.dejarResenia(dto.getUsuarioId(), dto.getGimnasioId(), dto.getTexto(), dto.getValoracion()));
    }

    @DeleteMapping("/resenia/usuario/{usuarioId}/gimnasio/{gimnasioId}")
    public ResponseEntity<Void> eliminarResenia(
            @PathVariable Long usuarioId,
            @PathVariable Long gimnasioId) {
        interaccionService.eliminarResenia(usuarioId, gimnasioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/gimnasio/{gimnasioId}/estadisticas")
    public ResponseEntity<EstadisticasGimnasioDTO> obtenerEstadisticas(@PathVariable Long gimnasioId) {
        return ResponseEntity.ok(EstadisticasGimnasioDTO.builder()
                .apuntados(interaccionService.contarApuntados(gimnasioId))
                .resenias(interaccionService.contarResenias(gimnasioId))
                .build());
    }
}
