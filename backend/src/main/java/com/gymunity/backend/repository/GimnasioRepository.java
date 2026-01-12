package com.gymunity.backend.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
     * Verifica si existe un gimnasio con el nombre y ciudad indicados.
     *
     * @param nombre Nombre del gimnasio.
     * @param ciudad Ciudad del gimnasio.
     * @return true si existe, false en caso contrario.
     */
    boolean existsByNombreIgnoreCaseAndCiudadIgnoreCase(String nombre, String ciudad);

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
<<<<<<< HEAD
     * Busca gimnasios con mayor valoración media.
     *
     * @return Lista de gimnasios ordenados por valoración media descendente.
     */
    @Query("SELECT g FROM Gimnasio g LEFT JOIN g.interacciones i " +
           "GROUP BY g.id ORDER BY AVG(COALESCE(i.valoracion, 0)) DESC, COUNT(CASE WHEN i.resenia IS NOT NULL THEN 1 END) DESC")
    List<Gimnasio> findMasPopulares();
=======
     * Busca gimnasios con más usuarios apuntados (más populares) con paginación.
     *
     * @param pageable Configuración de paginación.
     * @return Lista de gimnasios ordenados por popularidad.
     */
    @Query("SELECT g FROM Gimnasio g LEFT JOIN g.interacciones i " +
           "GROUP BY g.id ORDER BY COUNT(CASE WHEN i.esApuntado = true THEN 1 END) DESC")
    List<Gimnasio> findMasPopulares(Pageable pageable);
>>>>>>> 03bbdcc8efcc3fb46580ff6c70f5fd6451e5268e

    /**
     * Busca los gimnasios más recientes (últimos añadidos) con paginación.
     *
     * @param pageable Configuración de paginación.
     * @return Lista de gimnasios ordenados por ID descendente.
     */
    @Query("SELECT g FROM Gimnasio g ORDER BY g.id DESC")
    List<Gimnasio> findMasRecientes(Pageable pageable);

    /**
     * Obtiene la valoración media de un gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Valoración media o null si no hay valoraciones.
     */
    @Query("SELECT COALESCE(AVG(i.valoracion), 0.0) FROM Interaccion i WHERE i.gimnasio.id = :gimnasioId AND i.valoracion IS NOT NULL")
    Double calcularValoracionMedia(@Param("gimnasioId") Long gimnasioId);

    /**
     * Cuenta el total de reseñas de un gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Número de reseñas.
     */
    @Query("SELECT COUNT(i) FROM Interaccion i WHERE i.gimnasio.id = :gimnasioId AND i.resenia IS NOT NULL")
    int contarResenias(@Param("gimnasioId") Long gimnasioId);
}