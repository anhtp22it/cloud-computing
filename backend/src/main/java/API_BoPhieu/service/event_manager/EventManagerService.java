package API_BoPhieu.service.event_manager;

import java.util.List;

import API_BoPhieu.dto.event_managers.EventManagerDto;
import API_BoPhieu.dto.event_managers.EventManagerResponse;

public interface EventManagerService {
    EventManagerResponse assignEventManager(EventManagerDto dto, String assignerEmail);

    String removeEventManager(EventManagerDto dto, String removerEmail);

    List<EventManagerDto> findByEventId(Integer eventId);
}