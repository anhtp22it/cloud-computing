package API_BoPhieu.security;

import API_BoPhieu.constants.EventRole;
import API_BoPhieu.repository.EventManagerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("eventAuth")
@RequiredArgsConstructor
public class EventAuthorizationService {

    private final EventManagerRepo repo;

    public boolean hasEventRole(Authentication authentication,
            Integer eventId,
            EventRole requiredRole) {

        String email = authentication.getName();
        return repo.findRoleTypeByEmail(eventId, email)
                .map(EventRole::from)
                .filter(role -> role.atLeast(requiredRole))
                .isPresent();

    }
}
