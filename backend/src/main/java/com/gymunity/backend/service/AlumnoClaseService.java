package com.gymunity.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymunity.backend.dto.InscripcionResponseDTO;
import com.gymunity.backend.entity.AlumnoClase;
import com.gymunity.backend.entity.Clase;
import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.AlumnoClaseRepository;
import com.gymunity.backend.repository.ClaseRepository;
import com.gymunity.backend.repository.InteraccionRepository;
import com.gymunity.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AlumnoClaseService {

    private static final int MAX_CLASES_SIN_APUNTARSE = 3;

    private final AlumnoClaseRepository alumnoClaseRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClaseRepository claseRepository;
    private final InteraccionRepository interaccionRepository;

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
     * Inscribe un alumno en una clase.
     * 
     * REGLAS DE NEGOCIO:
     * 1. El usuario debe tener rol ALUMNO.
     * 2. El alumno no puede inscribirse en la misma clase dos veces.
     * 3. El alumno debe estar apuntado al gimnasio de la clase.
     * 4. No puede inscribirse en más de 3 clases si no está apuntado a ningún gimnasio.
     */
    public InscripcionResponseDTO inscribir(Long alumnoId, Long claseId) {
        Usuario alumno = validarAlumno(alumnoId);
        Clase clase = buscarClase(claseId);
        
        validarNoInscritoEnClase(alumnoId, claseId);
        validarApuntadoAlGimnasio(alumnoId, clase.getGimnasio().getId());
        validarLimiteClasesSinApuntarse(alumnoId);
        
        AlumnoClase inscripcion = AlumnoClase.builder()
                .alumno(alumno)
                .clase(clase)
                .build();
        
        return convertirADTO(alumnoClaseRepository.save(inscripcion));
    }

    /**
     * Cancela la inscripción de un alumno en una clase.
     */
    public void cancelarInscripcion(Long alumnoId, Long claseId) {
        AlumnoClase inscripcion = alumnoClaseRepository.findByAlumnoIdAndClaseId(alumnoId, claseId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Inscripción no encontrada"));
        alumnoClaseRepository.delete(inscripcion);
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

    private void validarNoInscritoEnClase(Long alumnoId, Long claseId) {
        if (alumnoClaseRepository.existsByAlumnoIdAndClaseId(alumnoId, claseId)) {
            throw new ReglaNegocioException("El alumno ya está inscrito en esta clase");
        }
    }

    private void validarApuntadoAlGimnasio(Long usuarioId, Long gimnasioId) {
        if (!interaccionRepository.estaApuntado(usuarioId, gimnasioId)) {
            throw new ReglaNegocioException("Debes apuntarte al gimnasio antes de inscribirte en sus clases");
        }
    }

    private void validarLimiteClasesSinApuntarse(Long alumnoId) {
        long totalClases = alumnoClaseRepository.findByAlumnoId(alumnoId).size();
        if (totalClases >= MAX_CLASES_SIN_APUNTARSE) {
            throw new ReglaNegocioException("Has alcanzado el límite de " + MAX_CLASES_SIN_APUNTARSE + 
                    " clases. Apúntate a un gimnasio para continuar.");
        }
    }

    private InscripcionResponseDTO convertirADTO(AlumnoClase inscripcion) {
        return InscripcionResponseDTO.builder()
                .id(inscripcion.getId())
                .alumnoId(inscripcion.getAlumno().getId())
                .nombreAlumno(inscripcion.getAlumno().getNombreUsuario())
                .claseId(inscripcion.getClase().getId())
                .nombreClase(inscripcion.getClase().getNombre())
                .fechaInscripcion(inscripcion.getFechaInscripcion())
                .build();
    }
}
