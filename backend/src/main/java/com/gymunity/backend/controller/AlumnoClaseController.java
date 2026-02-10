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

import com.gymunity.backend.dto.CancelacionResponseDTO;
import com.gymunity.backend.dto.InscripcionRequestDTO;
import com.gymunity.backend.dto.InscripcionResponseDTO;
import com.gymunity.backend.service.AlumnoClaseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inscripciones")
@RequiredArgsConstructor
public class AlumnoClaseController {

    private final AlumnoClaseService alumnoClaseService;

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<List<InscripcionResponseDTO>> obtenerClasesDeAlumno(@PathVariable Long alumnoId) {
        return ResponseEntity.ok(alumnoClaseService.obtenerClasesDeAlumno(alumnoId));
    }

    @GetMapping("/clase/{claseId}")
    public ResponseEntity<List<InscripcionResponseDTO>> obtenerAlumnosDeClase(@PathVariable Long claseId) {
        return ResponseEntity.ok(alumnoClaseService.obtenerAlumnosDeClase(claseId));
    }

    @PostMapping
    public ResponseEntity<InscripcionResponseDTO> inscribir(@Valid @RequestBody InscripcionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alumnoClaseService.inscribir(dto.getAlumnoId(), dto.getClaseId(), dto.getFechaClase()));
    }

    @DeleteMapping("/alumno/{alumnoId}/clase/{claseId}")
    public ResponseEntity<CancelacionResponseDTO> cancelarInscripcion(
            @PathVariable Long alumnoId,
            @PathVariable Long claseId) {
        CancelacionResponseDTO resultado = alumnoClaseService.cancelarInscripcion(alumnoId, claseId);
        return ResponseEntity.ok(resultado);
    }
}
