package org.underc0de.backend.service;

import org.springframework.stereotype.Service;
import org.underc0de.backend.dto.EventoDetalleDTO;
import org.underc0de.backend.dto.PremioDTO;
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
        // Buscar el evento por su nombre
        Optional<Evento> eventoOptional = eventoRepository.findEventoByNombre(nombreEvento);

        // Si el evento existe, lo retornamos
        if (eventoOptional.isPresent()) {
            return eventoOptional.get();
        }

        // Si no existe, creamos uno nuevo
        Evento nuevoEvento = new Evento();
        nuevoEvento.setNombre(nombreEvento);
        nuevoEvento.setFecha(LocalDateTime.now());

        return eventoRepository.save(nuevoEvento);
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
                .orElseThrow(() -> new IllegalStateException("No hay eventos disponibles en este momento."));
    }

    public void realizarSorteo() {
        Evento evento = obtenerUltimoEvento();

        evento.hacerSorteo();

        eventoRepository.save(evento);
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
        List<PremioDTO> premiosDTO = evento.getPremios()
                .stream()
                .map(premio -> new PremioDTO(
                        premio.getId(),
                        premio.getDescripcion(),
                        //                        premio.getSponsor(),
                        premio.getGanador() != null ? premio.getGanador().getNombre() : "No asignado",
                        premio.getGanador() != null ? premio.getGanador().getDni() : "No asignado"
                ))
                .collect(Collectors.toList());

        return new EventoDetalleDTO(evento.getId(), evento.getNombre(), evento.getFecha(), premiosDTO);
    }

}
