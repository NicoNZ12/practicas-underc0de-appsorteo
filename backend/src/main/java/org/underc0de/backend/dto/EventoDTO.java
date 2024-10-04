package org.underc0de.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record EventoDTO(
        @NotBlank(message = "Debes ingresar el nombre del evento")
        String nombre
) {
}
