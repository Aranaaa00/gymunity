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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gymunity.backend.dto.GimnasioCardDTO;
import com.gymunity.backend.dto.GimnasioDetalleDTO;
import com.gymunity.backend.dto.GimnasioRequestDTO;
import com.gymunity.backend.service.GimnasioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/gimnasios")
@RequiredArgsConstructor
public class GimnasioController {

    private final GimnasioService gimnasioService;

    @GetMapping
    public ResponseEntity<List<GimnasioCardDTO>> obtenerTodos() {
        return ResponseEntity.ok(gimnasioService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GimnasioDetalleDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(gimnasioService.obtenerPorId(id));
    }

    @GetMapping("/populares")
    public ResponseEntity<List<GimnasioCardDTO>> obtenerPopulares() {
        return ResponseEntity.ok(gimnasioService.obtenerPopulares());
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<GimnasioCardDTO>> obtenerRecientes() {
        return ResponseEntity.ok(gimnasioService.obtenerRecientes());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<GimnasioCardDTO>> buscar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String ciudad,
            @RequestParam(required = false) String arteMarcial) {
        
        if (nombre != null && !nombre.isBlank()) {
            return ResponseEntity.ok(gimnasioService.buscarPorNombre(nombre));
        }
        if (ciudad != null && !ciudad.isBlank()) {
            return ResponseEntity.ok(gimnasioService.buscarPorCiudad(ciudad));
        }
        if (arteMarcial != null && !arteMarcial.isBlank()) {
            return ResponseEntity.ok(gimnasioService.buscarPorArteMarcial(arteMarcial));
        }
        return ResponseEntity.ok(gimnasioService.obtenerTodos());
    }

    @PostMapping
    public ResponseEntity<GimnasioCardDTO> crear(@Valid @RequestBody GimnasioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gimnasioService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GimnasioCardDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody GimnasioRequestDTO dto) {
        return ResponseEntity.ok(gimnasioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        gimnasioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
