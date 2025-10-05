package API_BoPhieu.dto.event_managers;

import com.fasterxml.jackson.annotation.JsonProperty;
import API_BoPhieu.constants.EventManagement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventManagerDto {
    @JsonProperty("event_id")
    private Integer eventId;

    @JsonProperty("user_id")
    private Integer userId;

    private EventManagement roleType;

    @JsonProperty("assigned_by")
    private Integer assignedby;

}
