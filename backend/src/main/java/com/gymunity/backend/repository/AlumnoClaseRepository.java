package com.gymunity.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymunity.backend.entity.AlumnoClase;

/**
 * Repositorio para operaciones CRUD y consultas personalizadas de AlumnoClase.
 */
public interface AlumnoClaseRepository extends JpaRepository<AlumnoClase, Long> {

    /**
     * Busca inscripciones por ID del alumno.
     *
     * @param alumnoId ID del alumno.
     * @return Lista de inscripciones del alumno.
     */
    List<AlumnoClase> findByAlumnoId(Long alumnoId);

    /**
     * Busca inscripciones por ID de la clase.
     *
     * @param claseId ID de la clase.
     * @return Lista de inscripciones en esa clase.
     */
    List<AlumnoClase> findByClaseId(Long claseId);

    /**
     * Busca una inscripción específica de un alumno en una clase.
     *
     * @param alumnoId ID del alumno.
     * @param claseId ID de la clase.
     * @return Optional con la inscripción si existe.
     */
    Optional<AlumnoClase> findByAlumnoIdAndClaseId(Long alumnoId, Long claseId);

    /**
     * Verifica si un alumno está inscrito en una clase.
     *
     * @param alumnoId ID del alumno.
     * @param claseId ID de la clase.
     * @return true si está inscrito, false en caso contrario.
     */
    boolean existsByAlumnoIdAndClaseId(Long alumnoId, Long claseId);

    /**
     * Cuenta el número de alumnos en una clase.
     *
     * @param claseId ID de la clase.
     * @return Número de alumnos inscritos.
     */
    long countByClaseId(Long claseId);
}
