package org.underc0de.backend.service;

import org.springframework.stereotype.Service;
import org.underc0de.backend.advice.DniExistenteException;
import org.underc0de.backend.dto.EventoDTO;
import org.underc0de.backend.dto.ParticipanteDTO;
import org.underc0de.backend.dto.ParticipanteEventoDTO;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.entity.Participante;
import org.underc0de.backend.repository.IEventoRepository;
import org.underc0de.backend.repository.IParticipanteRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ParticipanteService {

    private final IParticipanteRepository participanteRepository;

    private final EventoService eventoService;
    private final IEventoRepository eventoRepository;

    public ParticipanteService(IParticipanteRepository participanteRepository, EventoService eventoService, IEventoRepository eventoRepository) {
        this.participanteRepository = participanteRepository;
        this.eventoService = eventoService;
        this.eventoRepository = eventoRepository;
    }


    public List<ParticipanteDTO> cargarParticipantes(List<ParticipanteEventoDTO> participanteEventoDTO){
//

//        Evento evento = eventoService.buscarEvento(participanteEventoDTO.idEvento());

        Evento evento = eventoService.obtenerUltimoEvento();

        Set<String> dnisProcesados = new HashSet<>();

        return participanteEventoDTO.stream().map(participantEventoDTO -> {

            String dni = participantEventoDTO.participante().dni();

            // Verificamos si el DNI ya fue procesado en esta carga
            if (dnisProcesados.contains(dni)) {
                throw new DniExistenteException("El participante con DNI " + dni + " ya fue cargado en esta lista.");
            }
            dnisProcesados.add(dni);

            Optional<Participante> participante = participanteRepository.findParticipanteByDni(dni);
            Participante participanteExistente;

            if (participante.isPresent()) {
                //Si el participante ya se encuentra asociado al evento
                participanteExistente = participante.get();

                if (participanteExistente.getEvento() != null && participanteExistente.getEvento().getId().equals(evento.getId())) {
                    throw new DniExistenteException("El participante con DNI " + participantEventoDTO.participante().dni() + " ya está registrado en este sorteo.");
                }  else {
//                    //Actualiza el evento si es un sorteo nuevo
                    participanteExistente.setEvento(evento);
                    participanteRepository.save(participanteExistente);
                    return new ParticipanteDTO(participanteExistente.getNombre(), participanteExistente.getDni());
                }
            }

            // Si el participante no existe, creamos uno nuevo
            Participante nuevoParticipante = new Participante();
            nuevoParticipante.setNombre(participantEventoDTO.participante().nombre());
            nuevoParticipante.setDni(participantEventoDTO.participante().dni());
            nuevoParticipante.setSorteos_ganados(0);
            nuevoParticipante.setEvento(evento);

            participanteRepository.save(nuevoParticipante);

            return new ParticipanteDTO(nuevoParticipante.getNombre(), nuevoParticipante.getDni());
        }).collect(Collectors.toList());
    }
}
