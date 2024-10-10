package org.underc0de.backend.dto;

public record PremioDTO(
        Long id,
        String descripcion,
//        String sponsor,
        String nombreGanador,
        String dniGanador
) {
}
