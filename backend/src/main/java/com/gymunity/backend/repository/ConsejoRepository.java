package com.gymunity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymunity.backend.entity.Consejo;

public interface ConsejoRepository extends JpaRepository<Consejo, Long> {

    List<Consejo> findByCategoriaIgnoreCase(String categoria);
}
