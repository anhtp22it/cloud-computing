package API_BoPhieu.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import API_BoPhieu.entity.Attendant;

public interface AttendantRepository extends JpaRepository<Attendant, Integer> {
    boolean existsByUserIdAndEventId(Integer userId, Integer eventId);

    List<Attendant> findByEventIdAndCheckedTimeIsNotNullOrderByCheckedTimeAsc(Integer eventId);

    List<Attendant> findByEventId(Integer eventId);

    Optional<Attendant> findByUserIdAndEventId(Integer userId, Integer eventId);

    boolean existsByEventIdAndUserId(Integer eventId, Integer userId);

    Integer countByEventId(Integer eventId);

    int deleteByEventIdAndUserId(Integer eventId, Integer userId);

    List<Attendant> findAllByEventIdAndUserIdIn(Integer eventId, List<Integer> userIds);

    @Query("SELECT a.eventId, COUNT(a.userId) FROM Attendant a WHERE a.eventId IN :eventIds GROUP BY a.eventId")
    List<Object[]> countParticipantsByEventIds(@Param("eventIds") List<Integer> eventIds);

    @Query("SELECT a.eventId FROM Attendant a WHERE a.userId = :userId AND a.eventId IN :eventIds")
    Set<Integer> findRegisteredEventIdsByUserId(@Param("userId") Integer userId,
            @Param("eventIds") List<Integer> eventIds);

    @Modifying
    long deleteByEventIdAndUserIdIn(Integer eventId, List<Integer> userIds);

}
