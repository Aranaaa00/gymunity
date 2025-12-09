package com.gymunity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gymunity.backend.dto.ClaseDTO;
import com.gymunity.backend.dto.ClaseRequestDTO;
import com.gymunity.backend.service.ClaseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clases")
@RequiredArgsConstructor
public class ClaseController {

    private final ClaseService claseService;

    @GetMapping
    public ResponseEntity<List<ClaseDTO>> obtenerTodas() {
        return ResponseEntity.ok(claseService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(claseService.obtenerPorId(id));
    }

    @GetMapping("/gimnasio/{gimnasioId}")
    public ResponseEntity<List<ClaseDTO>> obtenerPorGimnasio(@PathVariable Long gimnasioId) {
        return ResponseEntity.ok(claseService.obtenerPorGimnasio(gimnasioId));
    }

    @PostMapping
    public ResponseEntity<ClaseDTO> crear(@Valid @RequestBody ClaseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(claseService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClaseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClaseRequestDTO dto) {
        return ResponseEntity.ok(claseService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        claseService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
