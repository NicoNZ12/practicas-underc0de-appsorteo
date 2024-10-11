package org.underc0de.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Detalle completo de un evento, incluyendo premios y ganadores")
public record EventoDetalleDTO(

        @Schema(description = "ID del evento", example = "1")
        Long id,

        @Schema(description = "Nombre del evento", example = "Sorteo Anual")
        String nombre,

        @Schema(description = "Fecha de realización del evento")
        LocalDateTime fecha,

        @Schema(description = "Lista de premios con sus ganadores")
        List<PremioDetalleDTO> premios
) {
}
