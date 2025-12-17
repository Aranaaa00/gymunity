package com.gymunity.backend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymunity.backend.dto.UsuarioRegistroDTO;
import com.gymunity.backend.dto.UsuarioResponseDTO;
import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Obtiene todos los usuarios.
     */
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Obtiene un usuario por ID.
     */
    @Transactional(readOnly = true)
    public UsuarioResponseDTO obtenerPorId(Long id) {
        return convertirADTO(buscarPorId(id));
    }

    /**
     * Obtiene usuarios por rol.
     */
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> obtenerPorRol(Rol rol) {
        return usuarioRepository.findByRol(rol).stream()
                .map(this::convertirADTO)
                .toList();
    }

    /**
     * Registra un nuevo usuario.
     * REGLA: No puede existir otro usuario con el mismo email.
     */
    public UsuarioResponseDTO registrar(UsuarioRegistroDTO dto) {
        validarEmailUnico(dto.getEmail());
        Usuario usuario = crearUsuarioDesdeDTO(dto);
        usuario.setContrasenia(passwordEncoder.encode(dto.getContrasenia()));
        return convertirADTO(usuarioRepository.save(usuario));
    }

    /**
     * Registra un nuevo usuario y devuelve la entidad completa (para autenticación).
     */
    public Usuario registrarUsuario(UsuarioRegistroDTO dto) {
        validarEmailUnico(dto.getEmail());
        Usuario usuario = crearUsuarioDesdeDTO(dto);
        usuario.setContrasenia(passwordEncoder.encode(dto.getContrasenia()));
        return usuarioRepository.save(usuario);
    }

    /**
     * Actualiza un usuario existente.
     * REGLA: Si cambia el email, no puede coincidir con otro usuario.
     */
    public UsuarioResponseDTO actualizar(Long id, UsuarioRegistroDTO dto) {
        Usuario usuario = buscarPorId(id);
        validarCambioEmail(usuario.getEmail(), dto.getEmail());
        actualizarCampos(usuario, dto);
        if (dto.getContrasenia() != null && !dto.getContrasenia().isEmpty()) {
            usuario.setContrasenia(passwordEncoder.encode(dto.getContrasenia()));
        }
        return convertirADTO(usuarioRepository.save(usuario));
    }

    /**
     * Elimina un usuario por ID.
     */
    public void eliminar(Long id) {
        usuarioRepository.delete(buscarPorId(id));
    }

    /**
     * Busca usuario por email (para login).
     */
    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con email: " + email));
    }

    /**
     * Busca usuario por email o nombre de usuario (case insensitive).
     * Usado para login flexible.
     */
    @Transactional(readOnly = true)
    public Usuario buscarPorEmailOUsername(String identifier) {
        return usuarioRepository.findByEmailIgnoreCase(identifier)
                .or(() -> usuarioRepository.findByNombreUsuarioIgnoreCase(identifier))
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Usuario no encontrado con email o username: " + identifier));
    }

    // ========== MÉTODOS PRIVADOS ==========

    private Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con ID: " + id));
    }

    private void validarEmailUnico(String email) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new ReglaNegocioException("Ya existe un usuario con el email: " + email);
        }
    }

    private void validarCambioEmail(String emailActual, String emailNuevo) {
        if (!emailActual.equals(emailNuevo)) {
            validarEmailUnico(emailNuevo);
        }
    }

    private Usuario crearUsuarioDesdeDTO(UsuarioRegistroDTO dto) {
        return Usuario.builder()
                .nombreUsuario(dto.getNombreUsuario())
                .email(dto.getEmail())
                .contrasenia(dto.getContrasenia())
                .ciudad(dto.getCiudad())
                .rol(Rol.valueOf(dto.getRol().toUpperCase()))
                .build();
    }

    private void actualizarCampos(Usuario usuario, UsuarioRegistroDTO dto) {
        usuario.setNombreUsuario(dto.getNombreUsuario());
        usuario.setEmail(dto.getEmail());
        usuario.setCiudad(dto.getCiudad());
        usuario.setRol(Rol.valueOf(dto.getRol().toUpperCase()));
        // La contraseña se actualiza por separado en el método actualizar()
    }

    private UsuarioResponseDTO convertirADTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombreUsuario(usuario.getNombreUsuario())
                .email(usuario.getEmail())
                .rol(usuario.getRol().getNombre())
                .fechaRegistro(usuario.getFechaRegistro())
                .avatar(usuario.getAvatar())
                .ciudad(usuario.getCiudad())
                .build();
    }

    /**
     * Verifica si existe un usuario con el email dado.
     */
    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    /**
     * Verifica si existe un usuario con el nombre de usuario dado.
     */
    @Transactional(readOnly = true)
    public boolean existeUsername(String username) {
        return usuarioRepository.existsByNombreUsuarioIgnoreCase(username);
    }
}
