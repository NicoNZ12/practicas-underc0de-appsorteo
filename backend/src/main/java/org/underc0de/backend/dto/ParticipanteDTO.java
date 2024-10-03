package org.underc0de.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ParticipanteDTO(
        @NotBlank(message = "Debes ingresar tu nombre completo")
        String nombre,
        @NotNull(message = "Debes ingresar tu credencial")
        int credencial
) {
}
