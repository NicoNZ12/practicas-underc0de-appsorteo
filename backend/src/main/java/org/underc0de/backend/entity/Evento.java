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

    @Column(nullable = false)
    private boolean activo = true;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Participante> participantes;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Premio> premios;

    @PrePersist
    public void setFechaActual() {
        this.fecha = LocalDateTime.now();
    }

    public List<String> hacerSorteo() {

        List<String> resultados = new ArrayList<>();

        try {

            if (!activo) {
                throw new IllegalStateException("El evento ya ha sido finalizado y no puede realizarse un sorteo.");
            }

            if (premios.isEmpty() || participantes.isEmpty()) {

                throw new IllegalStateException("No hay premios o participantes disponibles para el sorteo.");
            }

            Random random = new Random();
            List<Participante> participantesDisponibles = new ArrayList<>(participantes);
            List<String> premiosSinGanador = new ArrayList<>();

            for (Premio premio : premios) {

                if (premio.getGanador() != null) {

                    continue;

                }

                if (participantesDisponibles.isEmpty()) {
                    // Si no hay más participantes disponibles, lanzar una excepción
                    premiosSinGanador.add("El premio " + premio.getDescripcion() + " quedó sin asignar.");
                    continue;

                }

                int ganadorIndex = random.nextInt(participantesDisponibles.size());
                Participante ganador = participantesDisponibles.get(ganadorIndex);

                premio.setGanador(ganador);
                ganador.setSorteos_ganados(ganador.getSorteos_ganados() + 1);

                resultados.add("Premio: " + premio.getDescripcion() + " asignado a " + ganador.getNombre() + " (DNI: " + ganador.getDni() + ")");

                participantesDisponibles.remove(ganador);

            }

            if (!premiosSinGanador.isEmpty()) {
                resultados.addAll(premiosSinGanador);
            }
            // Desactivar el evento después de realizar el sorteo
            this.activo = false;

        } catch (Exception e) {
            resultados.add("Error durante el sorteo: " + e.getMessage());
        }

        return resultados;

    }

}
