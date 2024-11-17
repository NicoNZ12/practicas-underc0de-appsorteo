package org.underc0de.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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

    @Operation(summary = "Crear un nuevo evento", description = "Este endpoint permite crear un evento, verificando si hay uno activo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Evento creado o actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos proporcionados"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity crearEvento(@RequestBody @Valid EventoDTO evento){

        try {


            Evento nuevoEvento = eventoService.crearEvento(evento.nombre());
            return ResponseEntity.ok(nuevoEvento);

        }catch (Exception e) {
            // Enviar una respuesta de error en caso de alguna excepción
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // En caso de error interno
        }

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


    @GetMapping("/filtrar-historial")
    public ResponseEntity<Page<EventoDetalleDTO>> obtenerEventosPaginados(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        // Validar el valor de 'page' para asegurarnos de que no sea negativo
        if (page < 0) {
            page = 0;  // Si el valor es negativo, asignar la primera página
        }

        // Llamar al servicio para obtener los eventos con los filtros aplicados
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("fecha")));

        Page<EventoDetalleDTO> eventos;

        // Si se proporcionan filtros, filtramos los eventos por año y mes
        if (year != null && month != null) {
            eventos = eventoService.obtenerEventosPorAnoYMes(year, month, pageable);
        } else if (year != null) {
            eventos = eventoService.obtenerEventosPorAno(year, pageable);
        } else if (month != null) {
            eventos = eventoService.obtenerEventosPorMes(month, pageable);
        } else {
            eventos = eventoService.obtenerEventos(pageable);
        }

        return ResponseEntity.ok(eventos);
    }

    @Operation(summary = "Obtener historial de eventos con paginación", description = "Obtiene eventos paginados con detalles y ganadores")
    @ApiResponse(responseCode = "200", description = "Lista de eventos obtenida exitosamente")
    @GetMapping("/historial-paginado")
    public ResponseEntity<Page<EventoDetalleDTO>> obtenerHistorialEventos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("fecha")));
        Page<EventoDetalleDTO> eventos = eventoService.obtenerHistorialEventosPaginados(pageable);

        return ResponseEntity.ok(eventos);
    }



}
