package com.gymunity.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gimnasio")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Gimnasio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @Column
    private String foto;

    @Column(nullable = false)
    private String ciudad;

    @Builder.Default
    @OneToMany(mappedBy = "gimnasio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Clase> clases = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "gimnasio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interaccion> interacciones = new ArrayList<>();
}
