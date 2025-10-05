package API_BoPhieu.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import API_BoPhieu.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findAllByEmailIn(List<String> emails);

    List<User> findByUnitId(Integer unitId);

    Boolean existsByUnitId(Integer unitId);

    Optional<User> findByPasswordResetToken(String token);
}
