package API_BoPhieu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import API_BoPhieu.entity.RefreshToken;
import API_BoPhieu.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);

    void deleteByUser(User user);
}
