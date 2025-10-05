package API_BoPhieu.repository;

import API_BoPhieu.entity.EventManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EventManagerRepo extends JpaRepository<EventManager, Integer> {
    /** Có bản ghi MANAGE/STAFF của user (qua email) trong event? */
    @Query("""
        select em.roleType
        from EventManager em
        join User u on u.id = em.userId
        where em.eventId = :eventId
          and u.email   = :email
    """)
    Optional<String> findRoleTypeByEmail(@Param("eventId") Integer eventId,
                                         @Param("email")   String email);
}


