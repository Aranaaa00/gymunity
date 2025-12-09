package com.gymunity.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "interaccion")
@NoArgsConstructor @AllArgsConstructor @Builder
@Getter
public class Interaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_interaccion;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Gimnasio gimnasio;

    @Column(nullable = false)
    private Boolean esApuntado;

    @Column(nullable = true, length = 1000)
    private String resenia;
    
    @Column(nullable = false)
    private LocalDate fecha_interaccion;

    @PrePersist
    protected void alCrear() {
        fecha_interaccion = LocalDate.now();
    }
}
