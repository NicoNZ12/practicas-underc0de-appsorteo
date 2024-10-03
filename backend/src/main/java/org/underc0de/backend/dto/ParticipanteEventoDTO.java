package org.underc0de.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ParticipanteEventoDTO(
       @NotBlank(message = "Debes ingresar el nombre del evento")
       String nombreEvento,
       @NotBlank(message = "Debes ingresar tu nombre completo")
       String nombreParticipante,
       @NotNull(message = "Debes ingresar tu credencial")
       int credencial

) {
}
