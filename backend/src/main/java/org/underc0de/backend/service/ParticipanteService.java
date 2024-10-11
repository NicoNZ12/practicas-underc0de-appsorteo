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

import java.util.*;
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


    public List<Participante> cargarParticipantes(List<ParticipanteDTO> participantesDTO){

        Evento evento = eventoService.obtenerUltimoEvento(); // Obtener el último evento
        List<Participante> participantesGuardados = new ArrayList<>();

        for (ParticipanteDTO participanteDTO : participantesDTO) {

            try {
                Participante participanteExistente = participanteRepository.findByDniAndEventoId(participanteDTO.dni(), evento.getId());

                // Verificar si el participante ya existe en el evento
                if (participanteExistente != null) {

                    // Si el participante ya está registrado, saltamos al siguiente
                    System.out.println("El participante con DNI " + participanteDTO.dni() + " ya está registrado.");
                    continue; // Continuar con el siguiente participante

                }

                Participante participantePreexistente = participanteRepository.findByDni(participanteDTO.dni());

                if (participantePreexistente != null) {
                    // Si el participante ya existe en la base de datos (pero en otro evento), se lo agrega al evento actual
                    participantePreexistente.setEvento(evento);
                    Participante participanteGuardado = participanteRepository.save(participantePreexistente);
                    participantesGuardados.add(participanteGuardado);
                } else {

                    // Crear el nuevo participante
                    Participante participante = new Participante();
                    participante.setNombre(participanteDTO.nombre());
                    participante.setDni(participanteDTO.dni());
                    participante.setEvento(evento);

                    // Guardar el participante
                    Participante participanteGuardado = participanteRepository.save(participante);
                    participantesGuardados.add(participanteGuardado);

                }

            } catch (Exception e) {
                // Manejar cualquier otra excepción que ocurra durante el proceso
                System.out.println("Error al agregar el participante: " + participanteDTO.dni() + ", error: " + e.getMessage());
            }

        }

        return participantesGuardados; // Retornar los participantes guardados

    }


    // Carga un participante
    public String agregarParticipante(ParticipanteDTO participanteDTO) {

        Evento evento = eventoService.obtenerUltimoEvento();

        try {
            // Verificar si el participante ya existe en el evento
            Participante participanteExistente = participanteRepository.findByDniAndEventoId(participanteDTO.dni(), evento.getId());
            if (participanteExistente != null) {
                return "El participante con DNI " + participanteDTO.dni() + " ya está registrado en este evento.";
            }

            Participante participantePreexistente = participanteRepository.findByDni(participanteDTO.dni());


            if (participantePreexistente != null) {
                // Si el participante ya existe (en otro evento), se lo agrega al evento actual
                participantePreexistente.setEvento(evento);
                participanteRepository.save(participantePreexistente);
                return "El participante con DNI " + participanteDTO.dni() + " fue registrado exitosamente en este evento.";
            } else {
                Participante participante = new Participante();
                participante.setNombre(participanteDTO.nombre());
                participante.setDni(participanteDTO.dni());
                participante.setEvento(evento);

                participanteRepository.save(participante);

                return "El participante con DNI " + participanteDTO.dni() + " fue registrado exitosamente.";
            }
        } catch (Exception e) {
            // Capturar cualquier otra excepción y retornar un mensaje de error
            return "Ocurrió un error al registrar el participante: " + e.getMessage();
        }
    }

}
