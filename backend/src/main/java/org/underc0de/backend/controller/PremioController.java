package org.underc0de.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.underc0de.backend.dto.PremioDTO;
import org.underc0de.backend.entity.Premio;
import org.underc0de.backend.service.PremioService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/premio")
@Tag(name = "Premio Controller", description = "Carga de premios y sponsors")
public class PremioController {

    private final PremioService premioService;

    public PremioController(PremioService premioService) {
        this.premioService = premioService;
    }


    @PostMapping()
    @Operation(summary = "Cargar premio y sponsor")
    public ResponseEntity cargarPremio(@RequestBody @Valid PremioDTO premioDTO){

        String premio = premioService.agregarPremio(premioDTO);

        if(premio.contains("El premio fue agregado correctamente")){
            return new ResponseEntity<>(premio, HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(premio, HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/agregar-premios")
    @Operation(summary = "Registrar varios premios en un evento")
    public ResponseEntity<Map<String, Object>> agregarPremios(@Valid @RequestBody List<PremioDTO> premiosDTO) {

        List<PremioDTO> resultado = premioService.agregarPremios(premiosDTO);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("message", resultado);

        if (!resultado.isEmpty()) {
            respuesta.put("message", "Todos los premios fueron agregados correctamente.");
            respuesta.put("Premios", resultado);
            return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
        }
    }

}
