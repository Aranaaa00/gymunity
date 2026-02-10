package com.gymunity.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymunity.backend.dto.ConsejoDTO;
import com.gymunity.backend.entity.Consejo;
import com.gymunity.backend.repository.ConsejoRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ConsejoService {

    private final ConsejoRepository consejoRepository;

    @Transactional(readOnly = true)
    public List<ConsejoDTO> obtenerTodos() {
        return consejoRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConsejoDTO> obtenerPorCategoria(String categoria) {
        return consejoRepository.findByCategoriaIgnoreCase(categoria).stream()
                .map(this::convertirADTO)
                .toList();
    }

    private ConsejoDTO convertirADTO(Consejo consejo) {
        return ConsejoDTO.builder()
                .id(consejo.getId())
                .titulo(consejo.getTitulo())
                .descripcion(consejo.getDescripcion())
                .categoria(consejo.getCategoria())
                .icono(consejo.getIcono())
                .build();
    }
}
