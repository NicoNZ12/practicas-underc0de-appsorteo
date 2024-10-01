package org.underc0de.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.underc0de.backend.entity.Premio;

public interface IPremioRepository extends JpaRepository<Premio, Long> {
}
