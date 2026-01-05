package com.gymunity.backend.controller;

import com.gymunity.backend.dto.AuthResponseDTO;
import com.gymunity.backend.dto.UsuarioLoginDTO;
import com.gymunity.backend.dto.UsuarioRegistroDTO;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.security.CustomUserDetailsService;
import com.gymunity.backend.security.JwtUtil;
import com.gymunity.backend.service.TokenBlacklistService;
import com.gymunity.backend.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para autenticación y registro de usuarios.
 * Gestiona el login y registro con JWT.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;
    private final TokenBlacklistService tokenBlacklistService;

    /**
     * Endpoint para login de usuarios.
     * Acepta email o nombre de usuario como identificador.
     * @param loginDTO credenciales del usuario
     * @return token JWT si las credenciales son correctas
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody UsuarioLoginDTO loginDTO) {
        
        String identifier = loginDTO.getEmail();
        
        // Autentica al usuario (CustomUserDetailsService busca por email o username)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        identifier,
                        loginDTO.getContrasenia()
                )
        );

        // Carga el usuario y genera el token
        UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);
        String token = jwtUtil.generateToken(userDetails);

        // Obtiene datos completos del usuario (por email o username)
        Usuario usuario = usuarioService.buscarPorEmailOUsername(identifier);

        AuthResponseDTO response = AuthResponseDTO.builder()
                .token(token)
                .email(usuario.getEmail())
                .nombreUsuario(usuario.getNombreUsuario())
                .rol(usuario.getRol().name())
                .id(usuario.getId())
                .ciudad(usuario.getCiudad())
                .avatar(usuario.getAvatar())
                .mensaje("Login exitoso")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para registro de nuevos usuarios.
     * @param registroDTO datos del nuevo usuario
     * @return token JWT del usuario registrado
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody UsuarioRegistroDTO registroDTO) {
        
        // Registra al usuario (la contraseña se encripta en el servicio)
        Usuario usuario = usuarioService.registrarUsuario(registroDTO);

        // Genera token para el usuario recién registrado
        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        AuthResponseDTO response = AuthResponseDTO.builder()
                .token(token)
                .email(usuario.getEmail())
                .nombreUsuario(usuario.getNombreUsuario())
                .rol(usuario.getRol().name())
                .id(usuario.getId())
                .ciudad(usuario.getCiudad())
                .avatar(usuario.getAvatar())
                .mensaje("Usuario registrado exitosamente")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint para verificar si el token es válido.
     * @return información del usuario si el token es válido
     */
    @GetMapping("/validate")
    public ResponseEntity<AuthResponseDTO> validateToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponseDTO.builder()
                            .mensaje("No autenticado")
                            .build());
        }
        
        String email = authentication.getName();
        Usuario usuario = usuarioService.buscarPorEmail(email);

        AuthResponseDTO response = AuthResponseDTO.builder()
                .email(usuario.getEmail())
                .nombreUsuario(usuario.getNombreUsuario())
                .rol(usuario.getRol().name())
                .id(usuario.getId())
                .mensaje("Token válido")
                .build();

        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para cerrar sesión (logout).
     * Revoca el token JWT agregándolo a la blacklist.
     * @param request solicitud HTTP para extraer el token del header
     * @return mensaje de confirmación
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponseDTO> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // Obtener fecha de expiración y revocar el token
            java.time.Instant expiration = jwtUtil.extractExpirationAsInstant(token);
            tokenBlacklistService.revokeToken(token, expiration);
            
            AuthResponseDTO response = AuthResponseDTO.builder()
                    .mensaje("Sesión cerrada exitosamente")
                    .build();
            
            return ResponseEntity.ok(response);
        }
        
        AuthResponseDTO response = AuthResponseDTO.builder()
                .mensaje("No se encontró token para cerrar sesión")
                .build();
        
        return ResponseEntity.badRequest().body(response);
    }
}
