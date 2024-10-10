package org.underc0de.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.underc0de.backend.entity.Evento;

import java.util.Optional;

public interface IEventoRepository extends JpaRepository<Evento, Long> {
    Optional<Evento> findEventoByNombre(String nombre);

    Optional<Evento> findEventoById(Long id);

    @Query("SELECT e FROM Evento e ORDER BY e.id DESC, e.fecha DESC")
    Optional<Evento> findEventoEnCurso();
}
