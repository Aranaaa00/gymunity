package com.gymunity.backend.entity;

public enum Rol {
    PROFESOR("Profesor"),
    ALUMNO("Alumno");

    private final String nombre;

    Rol(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}
