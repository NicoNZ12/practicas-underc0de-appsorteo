package org.underc0de.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.underc0de.backend.dto.EventoDTO;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.service.EventoService;

import java.util.List;

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

    @PostMapping("/sorteo")
    public ResponseEntity realizarSorteo() {

        try {

            eventoService.realizarSorteo();

            return ResponseEntity.ok("Sorteo realizado exitosamente");

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }

    }

    @GetMapping
    public ResponseEntity obtenerEvento(@RequestBody @Valid EventoDTO evento){

        try {

            Evento ultimoEvento = eventoService.obtenerUltimoEvento();

            return ResponseEntity.ok(ultimoEvento);

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest().body(null);

        }


    }

    @GetMapping("/td")
    public ResponseEntity<List<Evento>> obtenerTodosLosEventos() {

        List<Evento> eventos = eventoService.obtenerTodosLosEventos();

        return ResponseEntity.ok(eventos);

    }

}
