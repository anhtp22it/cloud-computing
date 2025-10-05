package API_BoPhieu.dto.attendant;

import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonProperty;
import API_BoPhieu.dto.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantResponse {
    private Integer id;
    private UserResponseDTO user;
    @JsonProperty("check_in_time")
    private Instant checkInTime;
    @JsonProperty("event_id")
    private Integer eventId;
    @JsonProperty("joined_at")
    private Instant joinedAt;
}
