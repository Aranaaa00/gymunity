package com.gymunity.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymunity.backend.dto.InteraccionResponseDTO;
import com.gymunity.backend.dto.ReseniaDTO;
import com.gymunity.backend.entity.Gimnasio;
import com.gymunity.backend.entity.Interaccion;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.GimnasioRepository;
import com.gymunity.backend.repository.InteraccionRepository;
import com.gymunity.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class InteraccionService {

    private final InteraccionRepository interaccionRepository;
    private final UsuarioRepository usuarioRepository;
    private final GimnasioRepository gimnasioRepository;

    /**
     * Obtiene las reseñas de un gimnasio.
     */
    @Transactional(readOnly = true)
    public List<ReseniaDTO> obtenerReseniasDeGimnasio(Long gimnasioId) {
        return interaccionRepository.findByGimnasioIdAndReseniaIsNotNull(gimnasioId).stream()
                .map(this::convertirAReseniaDTO)
                .toList();
    }

    /**
     * Apunta un usuario a un gimnasio.
     * REGLA: No puede apuntarse si ya está apuntado.
     */
    public InteraccionResponseDTO apuntarse(Long usuarioId, Long gimnasioId) {
        validarNoApuntado(usuarioId, gimnasioId);
        
        Usuario usuario = buscarUsuario(usuarioId);
        Gimnasio gimnasio = buscarGimnasio(gimnasioId);
        
        Interaccion interaccion = Interaccion.builder()
                .usuario(usuario)
                .gimnasio(gimnasio)
                .esApuntado(true)
                .build();
        
        return convertirAResponseDTO(interaccionRepository.save(interaccion));
    }

    /**
     * Desapunta un usuario de un gimnasio.
     */
    public void desapuntarse(Long usuarioId, Long gimnasioId) {
        Interaccion interaccion = buscarInteraccion(usuarioId, gimnasioId);
        interaccion.setEsApuntado(false);
        interaccionRepository.save(interaccion);
    }

    /**
     * Añade o actualiza una reseña.
     * REGLA: Solo puede dejar reseña si está apuntado al gimnasio.
     */
    public InteraccionResponseDTO dejarResenia(Long usuarioId, Long gimnasioId, String textoResenia) {
        validarApuntado(usuarioId, gimnasioId);
        
        Interaccion interaccion = interaccionRepository.findByUsuarioIdAndGimnasioId(usuarioId, gimnasioId)
                .orElseGet(() -> crearNuevaInteraccion(usuarioId, gimnasioId));
        
        interaccion.setResenia(textoResenia);
        return convertirAResponseDTO(interaccionRepository.save(interaccion));
    }

    /**
     * Elimina una reseña.
     */
    public void eliminarResenia(Long usuarioId, Long gimnasioId) {
        Interaccion interaccion = buscarInteraccion(usuarioId, gimnasioId);
        interaccion.setResenia(null);
        interaccionRepository.save(interaccion);
    }

    /**
     * Cuenta usuarios apuntados a un gimnasio.
     */
    @Transactional(readOnly = true)
    public long contarApuntados(Long gimnasioId) {
        return interaccionRepository.countByGimnasioIdAndEsApuntadoTrue(gimnasioId);
    }

    /**
     * Cuenta reseñas de un gimnasio.
     */
    @Transactional(readOnly = true)
    public long contarResenias(Long gimnasioId) {
        return interaccionRepository.countByGimnasioIdAndReseniaIsNotNull(gimnasioId);
    }

    // ========== MÉTODOS PRIVADOS ==========

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
    }

    private Gimnasio buscarGimnasio(Long id) {
        return gimnasioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Gimnasio no encontrado con ID: " + id));
    }

    private Interaccion buscarInteraccion(Long usuarioId, Long gimnasioId) {
        return interaccionRepository.findByUsuarioIdAndGimnasioId(usuarioId, gimnasioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Interacción no encontrada"));
    }

    private void validarNoApuntado(Long usuarioId, Long gimnasioId) {
        if (interaccionRepository.estaApuntado(usuarioId, gimnasioId)) {
            throw new ReglaNegocioException("El usuario ya está apuntado a este gimnasio");
        }
    }

    private void validarApuntado(Long usuarioId, Long gimnasioId) {
        if (!interaccionRepository.estaApuntado(usuarioId, gimnasioId)) {
            throw new ReglaNegocioException("Debes estar apuntado al gimnasio para dejar una reseña");
        }
    }

    private Interaccion crearNuevaInteraccion(Long usuarioId, Long gimnasioId) {
        return Interaccion.builder()
                .usuario(buscarUsuario(usuarioId))
                .gimnasio(buscarGimnasio(gimnasioId))
                .esApuntado(true)
                .build();
    }

    private ReseniaDTO convertirAReseniaDTO(Interaccion interaccion) {
        return ReseniaDTO.builder()
                .id(interaccion.getId())
                .nombreUsuario(interaccion.getUsuario().getNombreUsuario())
                .avatarUsuario(interaccion.getUsuario().getAvatar())
                .texto(interaccion.getResenia())
                .fecha(interaccion.getFechaInteraccion())
                .build();
    }

    private InteraccionResponseDTO convertirAResponseDTO(Interaccion interaccion) {
        return InteraccionResponseDTO.builder()
                .id(interaccion.getId())
                .usuarioId(interaccion.getUsuario().getId())
                .nombreUsuario(interaccion.getUsuario().getNombreUsuario())
                .gimnasioId(interaccion.getGimnasio().getId())
                .nombreGimnasio(interaccion.getGimnasio().getNombre())
                .esApuntado(interaccion.getEsApuntado())
                .resenia(interaccion.getResenia())
                .fechaInteraccion(interaccion.getFechaInteraccion())
                .build();
    }
}
