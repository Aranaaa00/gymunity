package com.gymunity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymunity.backend.entity.Clase;

/**
 * Repositorio para operaciones CRUD y consultas personalizadas de Clase.
 */
public interface ClaseRepository extends JpaRepository<Clase, Long> {

    /**
     * Busca clases por ID del gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Lista de clases del gimnasio.
     */
    List<Clase> findByGimnasioId(Long gimnasioId);

    /**
     * Busca clases cuyo nombre contenga el texto indicado.
     *
     * @param nombre Texto a buscar.
     * @return Lista de clases que coinciden.
     */
    List<Clase> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca clases por ID del profesor.
     *
     * @param profesorId ID del profesor.
     * @return Lista de clases impartidas por ese profesor.
     */
    List<Clase> findByProfesorId(Long profesorId);

    /**
     * Busca clases de un gimnasio cuyo nombre empiece por el texto indicado.
     *
     * @param gimnasioId ID del gimnasio.
     * @param nombre Prefijo del nombre de la clase.
     * @return Lista de clases que coinciden.
     */
    List<Clase> findByGimnasioIdAndNombreStartingWithIgnoreCase(Long gimnasioId, String nombre);
}