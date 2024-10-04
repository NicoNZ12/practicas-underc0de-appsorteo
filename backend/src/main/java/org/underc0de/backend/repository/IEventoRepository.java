package org.underc0de.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.underc0de.backend.entity.Evento;

import java.util.Optional;

public interface IEventoRepository extends JpaRepository<Evento, Long> {
    Optional<Evento> findEventoByNombre(String nombre);

    Optional<Evento> findEventoById(Long id);
}
