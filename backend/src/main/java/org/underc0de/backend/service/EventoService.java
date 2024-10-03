package org.underc0de.backend.service;

import org.springframework.stereotype.Service;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.repository.IEventoRepository;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class EventoService {
    private final IEventoRepository eventoRepository;

    public EventoService(IEventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public Evento buscarOCrearEvento(String nombreEvento) {
        // Buscar el evento por su nombre
        Optional<Evento> eventoOptional = eventoRepository.findEventoByNombre(nombreEvento);

        // Si el evento existe, lo retornamos
        if (eventoOptional.isPresent()) {
            return eventoOptional.get();
        }

        // Si no existe, creamos uno nuevo
        Evento nuevoEvento = new Evento();
        nuevoEvento.setNombre(nombreEvento);
        nuevoEvento.setFecha(LocalDate.now());

        return eventoRepository.save(nuevoEvento);
    }
}
