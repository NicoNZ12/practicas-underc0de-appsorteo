package org.underc0de.backend.dto;

import jakarta.validation.Valid;

public record ParticipanteEventoDTO(
        @Valid
        ParticipanteDTO participante,
        Long idEvento
) {
}
