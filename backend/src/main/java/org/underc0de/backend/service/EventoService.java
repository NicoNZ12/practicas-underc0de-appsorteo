package org.underc0de.backend.service;

import org.springframework.stereotype.Service;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.repository.IEventoRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

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
        nuevoEvento.setFecha(LocalDate.now());

        return eventoRepository.save(nuevoEvento);
    }

    public Evento buscarEvento(Long id){
        Optional<Evento> evento = eventoRepository.findEventoById(id);

        if(!evento.isPresent()){
            throw new RuntimeException("El evento con ID " + id + " no existe.");
        }

        return evento.get();
    }

    public void realizarSorteo() {
        Evento evento = eventoRepository.findEventoEnCurso()
                .orElseThrow(() -> new IllegalStateException("Evento no encontrado"));

        evento.realizarSorteo();

        eventoRepository.save(evento);
    }

    public List<Evento> obtenerTodosLosEventos() {
        return eventoRepository.findAll();
    }

    public Evento obtenerUltimoEvento() {
        return eventoRepository.findEventoEnCurso()
                .orElseThrow(() -> new IllegalStateException("No hay eventos disponibles."));
    }

}
