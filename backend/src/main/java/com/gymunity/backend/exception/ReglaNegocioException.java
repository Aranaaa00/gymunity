package com.gymunity.backend.exception;

/**
 * Excepción lanzada cuando se viola una regla de negocio.
 */
public class ReglaNegocioException extends RuntimeException {

    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
