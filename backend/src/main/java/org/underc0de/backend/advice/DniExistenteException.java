package org.underc0de.backend.advice;

public class DniExistenteException extends RuntimeException{
    public DniExistenteException(String message) {
        super(message);
    }
}
