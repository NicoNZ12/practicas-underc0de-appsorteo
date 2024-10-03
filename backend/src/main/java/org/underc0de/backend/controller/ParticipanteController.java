package org.underc0de.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.underc0de.backend.dto.ParticipanteDTO;
import org.underc0de.backend.dto.ParticipanteEventoDTO;
import org.underc0de.backend.service.ParticipanteService;

@RestController
@RequestMapping("/participante")
public class ParticipanteController {


    private final ParticipanteService participanteService;

    public ParticipanteController(ParticipanteService participanteService) {
        this.participanteService = participanteService;
    }

    @PostMapping("/guardar")
    public ResponseEntity<ParticipanteDTO> guardarParticipanteConEvento(@RequestBody @Valid ParticipanteEventoDTO participanteEventoDTO) {
        ParticipanteDTO participante = participanteService.cargarParticipante(participanteEventoDTO);
        return ResponseEntity.ok(participante);
    }
}
