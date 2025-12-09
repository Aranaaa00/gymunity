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
     * Carga un usuario por su email (usado como username en el sistema).
     * @param email el email del usuario
     * @return UserDetails con la información del usuario
     * @throws UsernameNotFoundException si no se encuentra el usuario
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getContrasenia())
                .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())
                ))
                .build();
    }
}
