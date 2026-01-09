package com.gymunity.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alumno_clase")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class AlumnoClase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alumno_id", nullable = false)
    private Usuario alumno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clase_id", nullable = false)
    private Clase clase;

    @Column(nullable = false)
    private LocalDate fechaInscripcion;

    @Column(nullable = false)
    private LocalDateTime fechaClase;

    @PrePersist
    protected void alCrear() {
        this.fechaInscripcion = LocalDate.now();
    }

    public boolean puedeCancelarConReembolso() {
        if (fechaClase == null) {
            return false;
        }
        LocalDateTime limite = fechaClase.minusHours(24);
        return LocalDateTime.now().isBefore(limite);
    }
}
