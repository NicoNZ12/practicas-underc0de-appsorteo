package org.underc0de.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.underc0de.backend.dto.EventoDetalleDTO;
import org.underc0de.backend.dto.PremioDetalleDTO;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.repository.IEventoRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class  EventoService {
    private final IEventoRepository eventoRepository;

    public EventoService(IEventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public Evento crearEvento(String nombreEvento) {

        Evento eventoActivo;

        try {
            // Buscar si hay evento activo
            eventoActivo = obtenerUltimoEvento();

        } catch (IllegalStateException e){

            // Si no existe, creamos uno nuevo
            Evento nuevoEvento = new Evento();
            nuevoEvento.setNombre(nombreEvento);
            nuevoEvento.setFecha(LocalDateTime.now());

            return eventoRepository.save(nuevoEvento);

        }
        // Si hay evento activo
        // Verificar si el nombre ingresado es diferente al del evento activo
        if (!eventoActivo.getNombre().equalsIgnoreCase(nombreEvento)) {

            eventoActivo.setNombre(nombreEvento);
            return eventoRepository.save(eventoActivo);
        }

        // Retornar el evento existente si el nombre es el mismo
        return eventoActivo;

    }

    public Evento buscarEvento(Long id){
        Optional<Evento> evento = eventoRepository.findEventoById(id);

        if(!evento.isPresent()){
            throw new RuntimeException("El evento con ID " + id + " no existe.");
        }

        return evento.get();
    }

    // Método para obtener el último evento
    public Evento obtenerUltimoEvento() {
        return eventoRepository.findEventoEnCurso()
                .filter(Evento::isActivo)
                .orElseThrow(() -> new IllegalStateException("No hay eventos disponibles en este momento."));
    }

    public List<String> realizarSorteo() {

        Evento evento = obtenerUltimoEvento();
        List<String> resultados = evento.hacerSorteo();

        eventoRepository.save(evento);

        return resultados;

    }

    public List<EventoDetalleDTO> obtenerHistorialEventos() {
        return eventoRepository.findAll()
                .stream()
                .map(this::mapearEventoADetalleDTO)
                .collect(Collectors.toList());
    }

    public EventoDetalleDTO obtenerEventoConGanadores(Long eventoId) {
        Evento evento = buscarEvento(eventoId);
        return mapearEventoADetalleDTO(evento);
    }

    private EventoDetalleDTO mapearEventoADetalleDTO(Evento evento) {
        List<PremioDetalleDTO> premiosDTO = evento.getPremios()
                .stream()
                .map(premio -> new PremioDetalleDTO(
                        premio.getId(),
                        premio.getDescripcion(),
                        premio.getSponsor(),
                        premio.getGanador() != null ? premio.getGanador().getNombre() : "No asignado",
                        premio.getGanador() != null ? premio.getGanador().getDni() : "No asignado"
                ))
                .collect(Collectors.toList());

        return new EventoDetalleDTO(evento.getId(), evento.getNombre(), evento.getFecha(), premiosDTO);
    }



    // Obtener eventos por año y mes
    public Page<EventoDetalleDTO> obtenerEventosPorAnoYMes(int year, int month, Pageable pageable) {
        return eventoRepository.findByYearAndMonth(year, month, pageable).map(this::mapearEventoADetalleDTO);
    }

    // Obtener eventos por solo año
    public Page<EventoDetalleDTO> obtenerEventosPorAno(int year, Pageable pageable) {
        return eventoRepository.findByYear(year, pageable).map(this::mapearEventoADetalleDTO);
    }

    // Obtener eventos por solo mes
    public Page<EventoDetalleDTO> obtenerEventosPorMes(int month, Pageable pageable) {
        return eventoRepository.findByMonth(month, pageable).map(this::mapearEventoADetalleDTO);
    }

    // Obtener todos los eventos
    public Page<EventoDetalleDTO> obtenerEventos(Pageable pageable) {
        return eventoRepository.findAll(pageable).map(this::mapearEventoADetalleDTO);
    }

    public Page<EventoDetalleDTO> obtenerHistorialEventosPaginados(Pageable pageable) {
        Page<Evento> eventosPaginados = eventoRepository.findAll(pageable);

        return eventosPaginados.map(this::mapearEventoADetalleDTO);
    }


}
