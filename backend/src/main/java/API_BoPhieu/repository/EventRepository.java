package API_BoPhieu.repository;

import java.util.Optional;
import java.time.Instant;
import java.util.List;

import API_BoPhieu.constants.EventStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import API_BoPhieu.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer>, JpaSpecificationExecutor<Event> {
        Optional<Event> findByQrJoinToken(String qrJoinToken);

        long countByStatus(EventStatus status);

        Optional<Event> findByIdAndStatus(Integer id, EventStatus status);

        Page<Event> findByCreateBy(Integer userId, Pageable pageable);

        @Query("SELECT e FROM Event e JOIN Attendant a ON e.id = a.eventId WHERE a.userId = :userId")
        Page<Event> findEventsByUserId(@Param("userId") Integer userId, Pageable pageable);

        @Modifying
        @Query("UPDATE Event e SET e.status = 'ONGOING' WHERE e.status = 'UPCOMING' AND e.startTime <= :now")
        int updateUpcomingToOngoing(@Param("now") Instant now);

        @Modifying
        @Query("UPDATE Event e SET e.status = 'COMPLETED' WHERE e.status = 'ONGOING' AND e.endTime <= :now")
        int updateOngoingToCompleted(@Param("now") Instant now);

        @Query("SELECT e.status, COUNT(e.id) FROM Event e GROUP BY e.status")
        List<Object[]> countEventsByStatus();

        @Query("SELECT COUNT(e.id) FROM Event e JOIN EventManager em ON em.eventId = e.id WHERE em.userId = :userId AND e.status <> 'CANCELLED'")
        long countManagedEventsByUserId(@Param("userId") Integer userId);
}