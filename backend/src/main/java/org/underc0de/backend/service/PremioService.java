package org.underc0de.backend.service;

import org.springframework.stereotype.Service;
import org.underc0de.backend.dto.PremioDTO;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.entity.Premio;
import org.underc0de.backend.repository.IEventoRepository;
import org.underc0de.backend.repository.IPremioRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PremioService {

    private final IEventoRepository eventoRepository;
    private final IPremioRepository premioRepository;
    private final EventoService eventoService;

    public PremioService(IEventoRepository eventoRepository, IPremioRepository premioRepository, EventoService eventoService) {
        this.eventoRepository = eventoRepository;
        this.premioRepository = premioRepository;
        this.eventoService = eventoService;
    }

    //Cargar premio y sponsor
    public String agregarPremio(PremioDTO premioDTO){
        Evento evento = eventoService.obtenerUltimoEvento();

        try{
            Optional<Premio> premioPreexistente = premioRepository.findByDescripcionAndSponsorAndEvento(premioDTO.descripcion(), premioDTO.sponsor(), evento);

            if(premioPreexistente.isPresent()){
                return "El premio ya está cargado en este sorteo";
            }

            Premio premio = new Premio();
            premio.setDescripcion(premioDTO.descripcion());
            premio.setSponsor(premioDTO.sponsor());
            premio.setEvento(evento);
            premio.setGanador(null); //Luego se actualiza cuando se haga el sorteo

            premioRepository.save(premio);

            return "El premio fue agregado correctamente";
        }catch (Exception e){
            return "Ocurrió un error al añadir el premio: " + e.getMessage();
        }
    }

    //Cargar premios y sponsors
    public List<PremioDTO> agregarPremios(List<PremioDTO> premiosDTO) {
        Evento evento = eventoService.obtenerUltimoEvento();
        List<PremioDTO> resultados = new ArrayList<>();


        for (PremioDTO premioDTO : premiosDTO) {
            try {
                Premio premio = new Premio();
                premio.setDescripcion(premioDTO.descripcion());
                premio.setSponsor(premioDTO.sponsor());
                premio.setEvento(evento);
                premio.setGanador(null); // Se actualizará cuando se haga el sorteo

                premioRepository.save(premio);

                PremioDTO premioGuardado = new PremioDTO(premio.getDescripcion(), premio.getSponsor());
                resultados.add(premioGuardado);

            } catch (Exception e) {
                System.out.println("Error al agregar el premio '" + premioDTO.descripcion() + "': " + e.getMessage());
            }
        }

        return resultados;
    }
}
