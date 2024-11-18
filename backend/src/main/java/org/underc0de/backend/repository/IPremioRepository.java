package org.underc0de.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.underc0de.backend.entity.Evento;
import org.underc0de.backend.entity.Premio;

import java.util.Optional;

public interface IPremioRepository extends JpaRepository<Premio, Long> {
    Optional<Premio> findByDescripcionAndSponsorAndEvento(String descripcion, String sponsor, Evento evento);
}
