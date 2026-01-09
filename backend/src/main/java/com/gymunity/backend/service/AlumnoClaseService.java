package com.gymunity.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymunity.backend.dto.CancelacionResponseDTO;
import com.gymunity.backend.dto.InscripcionResponseDTO;
import com.gymunity.backend.entity.AlumnoClase;
import com.gymunity.backend.entity.Clase;
import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.AlumnoClaseRepository;
import com.gymunity.backend.repository.ClaseRepository;
import com.gymunity.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AlumnoClaseService {

    private final AlumnoClaseRepository alumnoClaseRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClaseRepository claseRepository;

    /**
     * Obtiene las clases de un alumno.
     */
    @Transactional(readOnly = true)
    public List<InscripcionResponseDTO> obtenerClasesDeAlumno(Long alumnoId) {
        return alumnoClaseRepository.findByAlumnoId(alumnoId).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene los alumnos de una clase.
     */
    @Transactional(readOnly = true)
    public List<InscripcionResponseDTO> obtenerAlumnosDeClase(Long claseId) {
        return alumnoClaseRepository.findByClaseId(claseId).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Inscribe un alumno en una clase para una fecha específica.
     * 
     * REGLAS DE NEGOCIO:
     * 1. El usuario debe tener rol ALUMNO.
     * 2. El alumno no puede inscribirse en la misma clase para la misma fecha.
     * 3. La fecha de la clase debe ser futura.
     */
    public InscripcionResponseDTO inscribir(Long alumnoId, Long claseId, LocalDateTime fechaClase) {
        Usuario alumno = validarAlumno(alumnoId);
        Clase clase = buscarClase(claseId);
        
        validarFechaFutura(fechaClase);
        validarNoInscritoEnFecha(alumnoId, claseId, fechaClase);
        
        AlumnoClase inscripcion = AlumnoClase.builder()
                .alumno(alumno)
                .clase(clase)
                .fechaClase(fechaClase)
                .build();
        
        return convertirADTO(alumnoClaseRepository.save(inscripcion));
    }

    /**
     * Cancela la inscripción de un alumno en una clase.
     * Devuelve si se reembolsa el crédito (solo si cancela con más de 24h de antelación).
     */
    public CancelacionResponseDTO cancelarInscripcion(Long alumnoId, Long claseId) {
        AlumnoClase inscripcion = alumnoClaseRepository.findByAlumnoIdAndClaseId(alumnoId, claseId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Inscripción no encontrada"));
        
        boolean reembolso = inscripcion.puedeCancelarConReembolso();
        alumnoClaseRepository.delete(inscripcion);
        
        return CancelacionResponseDTO.builder()
                .reembolso(reembolso)
                .mensaje(reembolso 
                        ? "Reserva cancelada. Se ha devuelto 1 crédito." 
                        : "Reserva cancelada. No se devuelve el crédito (menos de 24h de antelación).")
                .build();
    }

    // ========== MÉTODOS PRIVADOS ==========

    private Usuario validarAlumno(Long alumnoId) {
        Usuario usuario = usuarioRepository.findById(alumnoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + alumnoId));
        
        if (usuario.getRol() != Rol.ALUMNO) {
            throw new ReglaNegocioException("Solo los usuarios con rol ALUMNO pueden inscribirse en clases");
        }
        return usuario;
    }

    private Clase buscarClase(Long claseId) {
        return claseRepository.findById(claseId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Clase no encontrada con ID: " + claseId));
    }

    private void validarFechaFutura(LocalDateTime fechaClase) {
        if (fechaClase.isBefore(LocalDateTime.now())) {
            throw new ReglaNegocioException("La fecha de la clase debe ser futura");
        }
    }

    private void validarNoInscritoEnFecha(Long alumnoId, Long claseId, LocalDateTime fechaClase) {
        if (alumnoClaseRepository.existsByAlumnoIdAndClaseIdAndFechaClase(alumnoId, claseId, fechaClase)) {
            throw new ReglaNegocioException("Ya estás inscrito en esta clase para esa fecha");
        }
    }

    private InscripcionResponseDTO convertirADTO(AlumnoClase inscripcion) {
        Clase clase = inscripcion.getClase();
        String profesorNombre = clase.getProfesor() != null 
                ? clase.getProfesor().getNombreUsuario() 
                : "Sin asignar";
        
        return InscripcionResponseDTO.builder()
                .id(inscripcion.getId())
                .alumnoId(inscripcion.getAlumno().getId())
                .alumnoNombre(inscripcion.getAlumno().getNombreUsuario())
                .claseId(clase.getId())
                .gimnasioId(clase.getGimnasio().getId())
                .claseNombre(clase.getNombre())
                .gimnasioNombre(clase.getGimnasio().getNombre())
                .profesorNombre(profesorNombre)
                .fechaInscripcion(inscripcion.getFechaInscripcion())
                .fechaClase(inscripcion.getFechaClase())
                .puedeReembolsar(inscripcion.puedeCancelarConReembolso())
                .build();
    }
}
