package org.underc0de.backend.service;

import org.springframework.stereotype.Service;
import org.underc0de.backend.dto.ParticipanteDTO;
import org.underc0de.backend.dto.ParticipanteEventoDTO;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.entity.Participante;
import org.underc0de.backend.repository.IParticipanteRepository;

import java.util.Optional;

@Service
public class ParticipanteService {

    private final IParticipanteRepository participanteRepository;

    private final EventoService eventoService;

    public ParticipanteService(IParticipanteRepository participanteRepository, EventoService eventoService) {
        this.participanteRepository = participanteRepository;
        this.eventoService = eventoService;
    }

    public ParticipanteDTO cargarParticipante(ParticipanteEventoDTO participanteEventoDTO){
        Optional<Participante> participante = participanteRepository.findParticipanteByCredencial(participanteEventoDTO.credencial());

        //Si el participante no existe en la bd, se carga uno nuevo
        Participante nuevoParticipante;

        if(participante.isPresent()){
            nuevoParticipante = participante.get();
        }else{
            nuevoParticipante = new Participante();
            nuevoParticipante.setNombre(participanteEventoDTO.nombreParticipante());
            nuevoParticipante.setCredencial(participanteEventoDTO.credencial());
            nuevoParticipante.setCantidad_ganados(0);
        }

        //Buscamos el evento o creamos uno para asociarlo al participante
        Evento evento = eventoService.buscarOCrearEvento(participanteEventoDTO.nombreEvento());

        //Asociamos el evento al participante
        nuevoParticipante.setEvento(evento);

        participanteRepository.save(nuevoParticipante);

        return new ParticipanteDTO(nuevoParticipante.getNombre(), nuevoParticipante.getCredencial());
    }
}
