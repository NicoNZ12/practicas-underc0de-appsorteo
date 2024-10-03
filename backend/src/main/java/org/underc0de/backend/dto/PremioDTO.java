package org.underc0de.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record PremioDTO(
        @NotBlank(message = "Debes ingresar el premio")
        String descripcion
) {
}
