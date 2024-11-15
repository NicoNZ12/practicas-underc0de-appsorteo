package org.underc0de.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.underc0de.backend.entity.Evento;

import java.util.Optional;

public interface IEventoRepository extends JpaRepository<Evento, Long> {
    Optional<Evento> findEventoByNombre(String nombre);

    Optional<Evento> findEventoById(Long id);

    @Query("SELECT e FROM Evento e WHERE e.activo = true")
    Optional<Evento> findEventoEnCurso();

    @Query("SELECT e FROM Evento e WHERE YEAR(e.fecha) = :year AND MONTH(e.fecha) = :month ORDER BY e.fecha DESC")
    Page<Evento> findByYearAndMonth(@Param("year") int year, @Param("month") int month, Pageable pageable);

    // Consulta para obtener eventos solo por año
    @Query("SELECT e FROM Evento e WHERE YEAR(e.fecha) = :year")
    Page<Evento> findByYear(@Param("year") int year, Pageable pageable);

    // Consulta para obtener eventos solo por mes
    @Query("SELECT e FROM Evento e WHERE MONTH(e.fecha) = :month")
    Page<Evento> findByMonth(@Param("month") int month, Pageable pageable);

}
