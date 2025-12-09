package com.gymunity.backend.exception;

/**
 * Excepción lanzada cuando un recurso no se encuentra.
 */
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
