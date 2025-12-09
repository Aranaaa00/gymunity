package com.gymunity.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymunity.backend.entity.Gimnasio;

public interface GimnasioRepository extends JpaRepository<Gimnasio, Long>{
    /**
     * Busca los gimnasios cuyo nombre empiece por el texto indicado.
     *
     * @param prefijo Prefijo de búsqueda (parte inicial del nombre).
     * @return Lista de gimnasios cuyo nombre comience con el prefijo.
     */

    List<Gimnasio> findByNombreStartingWithIgnoreCase(String prefijo);

    /**
     * Busca los gimnasios cuya ciudad empiece por el texto indicado.
     *
     * @param prefijo Prefijo de búsqueda (parte inicial de la ciudad/localidad).
     * @return Lista de gimnasios ubicados en ciudades que coinciden con el prefijo.
     */

    List<Gimnasio> findByCiudadStartingWithIgnoreCase(String prefijo);

    /**
     * Busca los gimnasios que tengan clases cuyo nombre empiece por el texto indicado.
     * 
     * Ejemplo: si prefijo = "kar", devolverá gimnasios que impartan "Karate Infantil",
     * "Karate Adultos", etc.
     *
     * El uso de "Distinct" evita que un gimnasio aparezca repetido si tiene varias clases
     * con nombres que empiecen igual.
     *
     * @param prefijo Prefijo de búsqueda del nombre de la clase (arte marcial).
     * @return Lista de gimnasios únicos que imparten clases con ese nombre.
     */
    
    List<Gimnasio> findDistinctByClasesNombreStartingWithIgnoreCase(String prefijo);
}