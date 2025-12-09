package com.gymunity.backend.entity;

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

import java.time.LocalDate;

@Entity
@Table(name = "interaccion")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Interaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gimnasio_id", nullable = false)
    private Gimnasio gimnasio;

    @Column(nullable = false)
    private Boolean esApuntado;

    @Column(length = 1000)
    private String resenia;

    @Column(nullable = false)
    private LocalDate fechaInteraccion;

    @PrePersist
    protected void alCrear() {
        this.fechaInteraccion = LocalDate.now();
    }
}
