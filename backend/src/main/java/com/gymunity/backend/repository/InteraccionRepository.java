package com.gymunity.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gymunity.backend.entity.Interaccion;

/**
 * Repositorio para operaciones CRUD y consultas personalizadas de Interaccion.
 */
public interface InteraccionRepository extends JpaRepository<Interaccion, Long> {

    /**
     * Busca interacciones por ID del usuario.
     *
     * @param usuarioId ID del usuario.
     * @return Lista de interacciones del usuario.
     */
    List<Interaccion> findByUsuarioId(Long usuarioId);

    /**
     * Busca interacciones por ID del gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Lista de interacciones del gimnasio.
     */
    List<Interaccion> findByGimnasioId(Long gimnasioId);

    /**
     * Busca una interacción específica de un usuario con un gimnasio.
     *
     * @param usuarioId ID del usuario.
     * @param gimnasioId ID del gimnasio.
     * @return Optional con la interacción si existe.
     */
    Optional<Interaccion> findByUsuarioIdAndGimnasioId(Long usuarioId, Long gimnasioId);

    /**
     * Busca reseñas (interacciones con texto) de un gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Lista de interacciones con reseña.
     */
    List<Interaccion> findByGimnasioIdAndReseniaIsNotNull(Long gimnasioId);

    /**
     * Cuenta usuarios apuntados a un gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Número de usuarios apuntados.
     */
    long countByGimnasioIdAndEsApuntadoTrue(Long gimnasioId);

    /**
     * Cuenta reseñas de un gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Número de reseñas.
     */
    long countByGimnasioIdAndReseniaIsNotNull(Long gimnasioId);

    /**
     * Verifica si un usuario está apuntado a un gimnasio.
     *
     * @param usuarioId ID del usuario.
     * @param gimnasioId ID del gimnasio.
     * @return true si está apuntado, false en caso contrario.
     */
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END " +
           "FROM Interaccion i " +
           "WHERE i.usuario.id = :usuarioId AND i.gimnasio.id = :gimnasioId AND i.esApuntado = true")
    boolean estaApuntado(@Param("usuarioId") Long usuarioId, @Param("gimnasioId") Long gimnasioId);

    /**
     * Calcula la valoración media de un gimnasio.
     *
     * @param gimnasioId ID del gimnasio.
     * @return Valoración media o null si no hay valoraciones.
     */
    @Query("SELECT AVG(i.valoracion) FROM Interaccion i WHERE i.gimnasio.id = :gimnasioId AND i.valoracion IS NOT NULL")
    Double calcularValoracionMedia(@Param("gimnasioId") Long gimnasioId);
}