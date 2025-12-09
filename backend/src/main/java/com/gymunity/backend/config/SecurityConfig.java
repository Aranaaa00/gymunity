package com.gymunity.backend.config;

import com.gymunity.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración de seguridad de la aplicación.
 * Define qué rutas son públicas y cuáles requieren autenticación.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    /**
     * Configura la cadena de filtros de seguridad.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas (sin autenticación)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/gimnasios/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/clases/**").permitAll()
                        
                        // Rutas protegidas - Usuarios
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").hasRole("PROFESOR")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole("PROFESOR")
                        
                        // Rutas protegidas - Gimnasios
                        .requestMatchers(HttpMethod.POST, "/api/gimnasios").hasRole("PROFESOR")
                        .requestMatchers(HttpMethod.PUT, "/api/gimnasios/**").hasRole("PROFESOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/gimnasios/**").hasRole("PROFESOR")
                        
                        // Rutas protegidas - Clases
                        .requestMatchers(HttpMethod.POST, "/api/clases").hasRole("PROFESOR")
                        .requestMatchers(HttpMethod.PUT, "/api/clases/**").hasRole("PROFESOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/clases/**").hasRole("PROFESOR")
                        
                        // Rutas protegidas - Inscripciones
                        .requestMatchers("/api/inscripciones/**").authenticated()
                        
                        // Rutas protegidas - Interacciones
                        .requestMatchers("/api/interacciones/**").authenticated()
                        
                        // Cualquier otra ruta requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin()) // Para H2 Console
                )
                .build();
    }

    /**
     * Proveedor de autenticación que usa BCrypt para contraseñas.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Codificador de contraseñas con BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Manager de autenticación para el login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
