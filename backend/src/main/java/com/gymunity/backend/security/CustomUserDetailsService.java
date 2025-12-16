package com.gymunity.backend.security;

import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Servicio personalizado para cargar usuarios desde la base de datos.
 * Spring Security usa este servicio para autenticar usuarios.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    /**
     * Carga un usuario por su email o nombre de usuario (case insensitive).
     * @param identifier el email o nombre de usuario
     * @return UserDetails con la información del usuario
     * @throws UsernameNotFoundException si no se encuentra el usuario
     */
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Buscar primero por email (case insensitive), luego por nombre de usuario
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(identifier)
                .or(() -> usuarioRepository.findByNombreUsuarioIgnoreCase(identifier))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con email o username: " + identifier));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getContrasenia())
                .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())
                ))
                .build();
    }
}
