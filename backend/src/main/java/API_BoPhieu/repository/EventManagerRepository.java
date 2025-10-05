package API_BoPhieu.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import API_BoPhieu.constants.EventManagement;
import API_BoPhieu.entity.EventManager;

@Repository
public interface EventManagerRepository extends JpaRepository<EventManager, Integer> {
    Optional<EventManager> findByUserIdAndEventId(Integer userId, Integer eventId);

    boolean existsByEventIdAndRoleType(Integer eventId,
            API_BoPhieu.constants.EventManagement roleType);

    boolean existsByEventIdAndUserIdAndRoleType(Integer eventId, Integer userId,
            API_BoPhieu.constants.EventManagement roleType);

    List<EventManager> findByEventIdAndRoleType(Integer eventId, EventManagement roleType);

    List<EventManager> findByUserId(Integer userId);

    List<EventManager> findByEventId(Integer eventId);

    List<EventManager> findAllByEventIdAndUserIdIn(Integer eventId, List<Integer> userIds);

    List<EventManager> findAllByEventIdInAndRoleType(List<Integer> eventIds,
            EventManagement roleType);

    List<EventManager> findAllByEventIdIn(List<Integer> eventIds);
}
