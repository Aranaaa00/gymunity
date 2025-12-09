package com.gymunity.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.gymunity.backend.entity.Gimnasio;
import com.gymunity.backend.repository.GimnasioRepository;

@Service
public class GimnasioService {
    private GimnasioRepository repo;

    public GimnasioService(GimnasioRepository repo) {
        this.repo = repo;
    }

    /**
     * Busca gimnasios cuyo nombre empiece por el texto indicado.

     * @param nombre Prefijo o texto de búsqueda.
     * @return Lista de gimnasios que coinciden con el nombre.
     */

    public List<Gimnasio> buscarPorNombre(String nombre) {
        return repo.findByNombreStartingWithIgnoreCase(nombre);
    }

    /**
     * Busca gimnasios cuya ciudad empiece por el texto indicado.
     *
     * @param nombre Prefijo o texto de búsqueda.
     * @return Lista de gimnasios que coinciden con la ciudad indicada.
     */

    public List<Gimnasio> buscarPorCiudad(String nombre) {
        return repo.findByCiudadStartingWithIgnoreCase(nombre);
    }

    /**
     * Busca gimnasios que tengan clases cuyo nombre empiece por el texto indicado.
     * Se utiliza DISTINCT para evitar duplicados si un gimnasio tiene varias clases con el mismo prefijo.
     *
     * @param nombre Prefijo o texto de búsqueda del arte marcial.
     * @return Lista de gimnasios que imparten esa disciplina.
     */

    public List<Gimnasio> buscarPorArteMarcial(String nombre) {
        return repo.findDistinctByClasesNombreStartingWithIgnoreCase(nombre);
    }
}
