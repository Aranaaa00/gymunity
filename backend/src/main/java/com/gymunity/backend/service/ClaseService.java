package com.gymunity.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymunity.backend.dto.ClaseDTO;
import com.gymunity.backend.dto.ClaseRequestDTO;
import com.gymunity.backend.entity.Clase;
import com.gymunity.backend.entity.Gimnasio;
import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.AlumnoClaseRepository;
import com.gymunity.backend.repository.ClaseRepository;
import com.gymunity.backend.repository.GimnasioRepository;
import com.gymunity.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ClaseService {

    private final ClaseRepository claseRepository;
    private final GimnasioRepository gimnasioRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlumnoClaseRepository alumnoClaseRepository;

    /**
     * Obtiene todas las clases.
     */
    @Transactional(readOnly = true)
    public List<ClaseDTO> obtenerTodas() {
        return claseRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene una clase por ID.
     */
    @Transactional(readOnly = true)
    public ClaseDTO obtenerPorId(Long id) {
        return convertirADTO(buscarPorId(id));
    }

    /**
     * Obtiene clases de un gimnasio.
     */
    @Transactional(readOnly = true)
    public List<ClaseDTO> obtenerPorGimnasio(Long gimnasioId) {
        return claseRepository.findByGimnasioId(gimnasioId).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Crea una nueva clase.
     * REGLA: El profesor asignado debe tener rol PROFESOR.
     */
    public ClaseDTO crear(ClaseRequestDTO dto) {
        Gimnasio gimnasio = buscarGimnasio(dto.getGimnasioId());
        Usuario profesor = validarYObtenerProfesor(dto.getProfesorId());
        
        Clase clase = Clase.builder()
                .nombre(dto.getNombre())
                .gimnasio(gimnasio)
                .profesor(profesor)
                .icono(dto.getIcono())
                .build();
        
        return convertirADTO(claseRepository.save(clase));
    }

    /**
     * Actualiza una clase existente.
     * REGLA: Si se cambia el profesor, debe tener rol PROFESOR.
     */
    public ClaseDTO actualizar(Long id, ClaseRequestDTO dto) {
        Clase clase = buscarPorId(id);
        Usuario profesor = validarYObtenerProfesor(dto.getProfesorId());
        
        clase.setNombre(dto.getNombre());
        clase.setProfesor(profesor);
        clase.setIcono(dto.getIcono());
        
        return convertirADTO(claseRepository.save(clase));
    }

    /**
     * Elimina una clase.
     * REGLA: No se puede eliminar si tiene alumnos inscritos.
     */
    public void eliminar(Long id) {
        Clase clase = buscarPorId(id);
        validarSinAlumnos(id);
        claseRepository.delete(clase);
    }

    // ========== MÉTODOS PRIVADOS ==========

    private Clase buscarPorId(Long id) {
        return claseRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Clase no encontrada con ID: " + id));
    }

    private Gimnasio buscarGimnasio(Long id) {
        return gimnasioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Gimnasio no encontrado con ID: " + id));
    }

    private Usuario validarYObtenerProfesor(Long profesorId) {
        if (profesorId == null) {
            return null;
        }
        Usuario profesor = usuarioRepository.findById(profesorId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Profesor no encontrado con ID: " + profesorId));
        
        if (profesor.getRol() != Rol.PROFESOR) {
            throw new ReglaNegocioException("El usuario con ID " + profesorId + " no tiene rol de PROFESOR");
        }
        return profesor;
    }

    private void validarSinAlumnos(Long claseId) {
        if (alumnoClaseRepository.countByClaseId(claseId) > 0) {
            throw new ReglaNegocioException("No se puede eliminar la clase porque tiene alumnos inscritos");
        }
    }

    private ClaseDTO convertirADTO(Clase clase) {
        return ClaseDTO.builder()
                .id(clase.getId())
                .nombre(clase.getNombre())
                .icono(clase.getIcono())
                .profesorNombre(clase.getProfesor() != null ? clase.getProfesor().getNombreUsuario() : null)
                .totalAlumnos((int) alumnoClaseRepository.countByClaseId(clase.getId()))
                .diasSemana(clase.getDiasSemana())
                .horaInicio(clase.getHoraInicio())
                .horaFin(clase.getHoraFin())
                .build();
    }
}
