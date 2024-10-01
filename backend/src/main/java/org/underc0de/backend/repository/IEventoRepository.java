package org.underc0de.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.underc0de.backend.entity.Evento;

public interface IEventoRepository extends JpaRepository<Evento, Long> {
}
