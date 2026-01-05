package com.gymunity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gymunity.backend.entity.Gimnasio;

/**
 * Repositorio para operaciones CRUD y consultas personalizadas de Gimnasio.
 */
public interface GimnasioRepository extends JpaRepository<Gimnasio, Long> {

    /**
     * Busca gimnasios cuyo nombre empiece por el texto indicado.
     *
     * @param prefijo Prefijo de búsqueda (parte inicial del nombre).
     * @return Lista de gimnasios cuyo nombre comience con el prefijo.
     */
    List<Gimnasio> findByNombreStartingWithIgnoreCase(String prefijo);

    /**
     * Busca gimnasios cuyo nombre contenga el texto indicado.
     *
     * @param nombre Texto a buscar en el nombre.
     * @return Lista de gimnasios que coinciden.
     */
    List<Gimnasio> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca gimnasios cuya ciudad empiece por el texto indicado.
     *
     * @param prefijo Prefijo de búsqueda (parte inicial de la ciudad).
     * @return Lista de gimnasios ubicados en ciudades que coinciden.
     */
    List<Gimnasio> findByCiudadStartingWithIgnoreCase(String prefijo);

    /**
     * Busca gimnasios por ciudad exacta (ignorando mayúsculas).
     *
     * @param ciudad Nombre de la ciudad.
     * @return Lista de gimnasios de esa ciudad.
     */
    List<Gimnasio> findByCiudadIgnoreCase(String ciudad);

    /**
     * Busca gimnasios que tengan clases cuyo nombre empiece por el texto indicado.
     * Usa DISTINCT para evitar duplicados.
     *
     * @param prefijo Prefijo del nombre de la clase.
     * @return Lista de gimnasios únicos que imparten esa disciplina.
     */
    List<Gimnasio> findDistinctByClasesNombreStartingWithIgnoreCase(String prefijo);

    /**
     * Busca gimnasios que tengan clases cuyo nombre contenga el texto indicado.
     *
     * @param nombre Texto a buscar en el nombre de la clase.
     * @return Lista de gimnasios que imparten esa disciplina.
     */
    List<Gimnasio> findDistinctByClasesNombreContainingIgnoreCase(String nombre);

    /**
     * Busca gimnasios con más usuarios apuntados (más populares).
     *
     * @return Lista de gimnasios ordenados por popularidad.
     */
    @Query("SELECT g FROM Gimnasio g LEFT JOIN g.interacciones i " +
           "GROUP BY g.id ORDER BY COUNT(CASE WHEN i.esApuntado = true THEN 1 END) DESC")
    List<Gimnasio> findMasPopulares();

    /**
     * Busca los gimnasios más recientes (últimos añadidos).
     *
     * @return Lista de gimnasios ordenados por ID descendente.
     */
    @Query("SELECT g FROM Gimnasio g ORDER BY g.id DESC")
    List<Gimnasio> findMasRecientes();
}