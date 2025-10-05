package API_BoPhieu.dto.event_managers;

import API_BoPhieu.constants.EventManagement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventManagerResponse {
    private Integer eventId;
    private EventManagement roleType;
    private Integer userId;
    private Integer assignedby;
}
