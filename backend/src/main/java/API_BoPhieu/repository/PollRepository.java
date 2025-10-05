package API_BoPhieu.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import API_BoPhieu.entity.Poll;

@Repository
public interface PollRepository extends JpaRepository<Poll, Integer> {
    List<Poll> findByEventId(Integer eventId);

    @Query("SELECT p FROM Poll p WHERE p.startTime <= :now AND p.endTime >= :now AND p.isDelete = false")
    List<Poll> findActivePollsByTime(@Param("now") Instant now);
}
