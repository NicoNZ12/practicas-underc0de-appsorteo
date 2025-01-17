package org.underc0de.backend.advice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class Validacion {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleInvalidArguments(MethodArgumentNotValidException ex){
        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(e -> {
            errores.put(e.getField(), e.getDefaultMessage());
        });

        return errores;
    }

    @ExceptionHandler(DniExistenteException.class)
    public ResponseEntity<String> handleCredencialYaExistente(DniExistenteException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleNoEventosDisponibles(IllegalStateException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }


}

