package org.underc0de.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "eventos")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha;


    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Participante> participantes;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Premio> premios;

    @PrePersist
    public void setFechaActual() {
        this.fecha = LocalDateTime.now();
    }

    public void hacerSorteo() {

        if (premios.isEmpty() || participantes.isEmpty()) {

            throw new IllegalStateException("No hay premios o participantes disponibles para el sorteo.");
        }

        Random random = new Random();
        List<Participante> participantesDisponibles = new ArrayList<>(participantes);

        for (Premio premio : premios) {

            if (premio.getGanador() != null) {

                continue;

            }

            if (participantesDisponibles.isEmpty()) {
                // Si no hay más participantes disponibles, lanzar una excepción
                throw new IllegalStateException("No hay suficientes participantes para asignar a todos los premios.");
            }

            int ganadorIndex = random.nextInt(participantesDisponibles.size());

            Participante ganador = participantesDisponibles.get(ganadorIndex);

            premio.setGanador(ganador);

            ganador.setSorteos_ganados(ganador.getSorteos_ganados() + 1);

            participantesDisponibles.remove(ganador);

        }
    }
}
