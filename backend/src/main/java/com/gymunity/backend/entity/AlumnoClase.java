package com.gymunity.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "alumno_clase")
@NoArgsConstructor @AllArgsConstructor @Builder 
@Getter
public class AlumnoClase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario alumno;

    @ManyToOne
    private Clase clase;

    @Column(nullable = false)
    private LocalDate fechaInscripcion;

    @PrePersist
    protected void alCrear() {
        fechaInscripcion = LocalDate.now();
    }
}
