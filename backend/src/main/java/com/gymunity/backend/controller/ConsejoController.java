package com.gymunity.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gymunity.backend.dto.ConsejoDTO;
import com.gymunity.backend.service.ConsejoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/consejos")
@RequiredArgsConstructor
public class ConsejoController {

    private final ConsejoService consejoService;

    @GetMapping
    public ResponseEntity<List<ConsejoDTO>> obtenerConsejos(
            @RequestParam(required = false) String categoria) {

        if (categoria != null && !categoria.isBlank()) {
            return ResponseEntity.ok(consejoService.obtenerPorCategoria(categoria));
        }
        return ResponseEntity.ok(consejoService.obtenerTodos());
    }
}
