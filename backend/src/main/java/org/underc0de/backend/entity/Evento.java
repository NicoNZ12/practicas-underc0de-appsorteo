package org.underc0de.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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
    private LocalDate fecha;


    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Participante> participantes;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Premio> premios;


    public void realizarSorteo() {

        if (premios.isEmpty() || participantes.isEmpty()) {

            throw new IllegalStateException("No hay premios o participantes disponibles para el sorteo.");
        }

        Random random = new Random();

        for (Premio premio : premios) {

            if (premio.getGanador() != null) {

                continue;

            }

            int ganadorIndex = random.nextInt(participantes.size());

            Participante ganador = participantes.get(ganadorIndex);

            premio.setGanador(ganador);

            ganador.setSorteos_ganados(ganador.getSorteos_ganados() + 1);
        }
    }
}
