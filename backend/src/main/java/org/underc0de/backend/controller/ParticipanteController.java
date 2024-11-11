package org.underc0de.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.underc0de.backend.dto.ParticipanteDTO;
import org.underc0de.backend.dto.ParticipanteEventoDTO;
import org.underc0de.backend.entity.Participante;
import org.underc0de.backend.service.ParticipanteService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/participante")
@Tag(name = "Participante Controller", description = "Carga de participantes")
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
    public ResponseEntity<Map<String,String>> agregarParticipante(@Valid @RequestBody ParticipanteDTO participanteDTO) {

        String resultado = participanteService.agregarParticipante(participanteDTO);

        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("message", resultado);

        if (resultado.contains("fue registrado exitosamente")) {

            return new ResponseEntity<>(respuesta, HttpStatus.CREATED);

        } else {

            return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);

        }

    }


    @GetMapping("/mostrar-participantes")
    public ResponseEntity<List<ParticipanteDTO>> obtenerParticipantes(){
        List<ParticipanteDTO> participantes= participanteService.obtenerParticipantes();
        return ResponseEntity.ok(participantes);
    }
}
