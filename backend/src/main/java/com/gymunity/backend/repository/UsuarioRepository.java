package com.gymunity.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymunity.backend.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
