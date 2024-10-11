package org.underc0de.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.underc0de.backend.dto.ParticipanteDTO;
import org.underc0de.backend.dto.ParticipanteEventoDTO;
import org.underc0de.backend.entity.Participante;
import org.underc0de.backend.service.ParticipanteService;

import java.util.List;

@RestController
@RequestMapping("/participante")
public class ParticipanteController {


    private final ParticipanteService participanteService;

    public ParticipanteController(ParticipanteService participanteService) {
        this.participanteService = participanteService;
    }

    @PostMapping("/carga-varios") // lista de participantes
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar varios participante en un evento")
    public ResponseEntity<List<Participante>> guardarParticipanteConEvento(@RequestBody @Valid List<ParticipanteDTO> participantesDTO) {

        List<Participante> participantesGuardados = participanteService.cargarParticipantes(participantesDTO);
        return new ResponseEntity<>(participantesGuardados, HttpStatus.CREATED);

    }

    @PostMapping("/agregar-participante")
    @Operation(summary = "Registrar un participante en un evento")
    public ResponseEntity<String> agregarParticipante(@Valid @RequestBody ParticipanteDTO participanteDTO) {

        String resultado = participanteService.agregarParticipante(participanteDTO);

        if (resultado.contains("fue registrado exitosamente")) {

            return new ResponseEntity<>(resultado, HttpStatus.CREATED);

        } else {

            return new ResponseEntity<>(resultado, HttpStatus.BAD_REQUEST);

        }

    }

}
