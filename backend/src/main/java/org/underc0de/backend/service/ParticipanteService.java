package org.underc0de.backend.service;

import org.springframework.stereotype.Service;
import org.underc0de.backend.advice.DniExistenteException;
import org.underc0de.backend.dto.EventoDTO;
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
        Optional<Participante> participante = participanteRepository.findParticipanteByDni(participanteEventoDTO.participante().dni());

        Evento evento = eventoService.buscarEvento(participanteEventoDTO.idEvento());

        Participante participanteExistente;

        if (participante.isPresent()) {
            //Si el participante ya se encuentra asociado al evento
            participanteExistente = participante.get();

            if (participanteExistente.getEvento().getId().equals(evento.getId())) {
                throw new DniExistenteException("El participante con DNI " + participanteEventoDTO.participante().dni() + " ya está registrado en este sorteo.");
            } else {
                //Actualiza el evento si es un sorteo nuevo
                participanteExistente.setEvento(evento);
                participanteRepository.save(participanteExistente);
                return new ParticipanteDTO(participanteExistente.getNombre(), participanteExistente.getDni());
            }
        }

        // Si el participante no existe, creamos uno nuevo
        Participante nuevoParticipante = new Participante();
        nuevoParticipante.setNombre(participanteEventoDTO.participante().nombre());
        nuevoParticipante.setDni(participanteEventoDTO.participante().dni());
        nuevoParticipante.setSorteos_ganados(0);
        nuevoParticipante.setEvento(evento);

        participanteRepository.save(nuevoParticipante);

        return new ParticipanteDTO(nuevoParticipante.getNombre(), nuevoParticipante.getDni());
    }
}
