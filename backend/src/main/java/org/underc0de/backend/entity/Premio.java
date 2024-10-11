package org.underc0de.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "premios")
public class Premio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    @JsonIgnore
    private Evento evento;

    @ManyToOne
    @JoinColumn(name = "id_participante_ganador")
    private Participante ganador;
}
