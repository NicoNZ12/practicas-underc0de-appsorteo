package org.underc0de.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.underc0de.backend.dto.EventoDTO;
import org.underc0de.backend.dto.EventoDetalleDTO;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.service.EventoService;


import java.util.List;

@RestController
@RequestMapping("/evento")
@Tag(name = "Evento Controller", description = "Gestión de eventos y sorteos")
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

    @Operation(summary = "Realizar un sorteo", description = "Realiza un sorteo para un evento específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sorteo realizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al realizar el sorteo (evento no encontrado o sin participantes)")
    })
    @PostMapping("/sorteo")
    public ResponseEntity<List<String>> realizarSorteo() {

        try {

            List<String> resultados = eventoService.realizarSorteo();

            return ResponseEntity.ok(resultados);

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest().body(List.of(e.getMessage()));

        }

    }

    @Operation(summary = "Obtener historial de eventos", description = "Obtiene todos los eventos realizados con sus detalles y ganadores")
    @ApiResponse(responseCode = "200", description = "Lista de eventos obtenida exitosamente")
    @GetMapping("/historial")
    public ResponseEntity<List<EventoDetalleDTO>> obtenerHistorialEventos() {

        List<EventoDetalleDTO> eventos = eventoService.obtenerHistorialEventos();

        return ResponseEntity.ok(eventos);

    }

    @Operation(summary = "Obtener detalle de evento segun id", description = "Obtiene el detalle de un evento específico con sus premios y ganadores")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Detalles del evento obtenidos exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error al obtener el evento (evento no encontrado)")
    })
    @GetMapping("/{id}")
    public ResponseEntity<EventoDetalleDTO> obtenerEventoConGanadores(@PathVariable Long id) {
        try {

            EventoDetalleDTO evento = eventoService.obtenerEventoConGanadores(id);

            return ResponseEntity.ok(evento);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(null);

        }
    }

}
