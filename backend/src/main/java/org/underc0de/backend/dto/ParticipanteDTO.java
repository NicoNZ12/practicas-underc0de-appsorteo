package org.underc0de.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ParticipanteDTO(
        @NotBlank(message = "Debes ingresar tu nombre completo")
        String nombre,
        @NotNull(message = "Debes ingresar tu dni")
        @Size(max = 8, min = 8, message = "El dni debe contener 8 digitos")
        String dni
) {
}
