package org.underc0de.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "participantes")
public class Participante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_completo", nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private int credencial;

    private int cantidad_ganados = 0;

    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;
}
