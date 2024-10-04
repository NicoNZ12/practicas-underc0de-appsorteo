package org.underc0de.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.underc0de.backend.entity.Participante;

import java.util.Optional;

public interface IParticipanteRepository extends JpaRepository<Participante, Long> {
    Optional<Participante> findParticipanteByDni(String dni);
}
