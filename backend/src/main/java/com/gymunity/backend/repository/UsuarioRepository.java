package com.gymunity.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.entity.Usuario;

import java.util.List;

/**
 * Repositorio para operaciones CRUD y consultas personalizadas de Usuario.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su email (único).
     *
     * @param email Email del usuario.
     * @return Optional con el usuario si existe.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email indicado.
     *
     * @param email Email a verificar.
     * @return true si existe, false en caso contrario.
     */
    boolean existsByEmail(String email);

    /**
     * Busca usuarios por rol (PROFESOR o ALUMNO).
     *
     * @param rol Rol del usuario.
     * @return Lista de usuarios con ese rol.
     */
    List<Usuario> findByRol(Rol rol);

    /**
     * Busca usuarios cuyo nombre contenga el texto indicado.
     *
     * @param nombre Texto a buscar en el nombre.
     * @return Lista de usuarios que coinciden.
     */
    List<Usuario> findByNombreUsuarioContainingIgnoreCase(String nombre);

    /**
     * Busca usuarios por ciudad.
     *
     * @param ciudad Ciudad del usuario.
     * @return Lista de usuarios de esa ciudad.
     */
    List<Usuario> findByCiudadIgnoreCase(String ciudad);
}
