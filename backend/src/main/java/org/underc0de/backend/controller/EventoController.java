package org.underc0de.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.underc0de.backend.dto.EventoDTO;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.service.EventoService;

@RestController
@RequestMapping("/evento")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @PostMapping
    public ResponseEntity crearEvento(@RequestBody @Valid EventoDTO evento){
        Evento nuevoEvento = eventoService.crearEvento(evento.nombre());
        return ResponseEntity.ok(nuevoEvento);

    }
}
