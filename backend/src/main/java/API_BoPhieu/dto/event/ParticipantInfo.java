package API_BoPhieu.dto.event;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantInfo {
    private Integer userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private Instant joinedAt;
    private Instant checkedTime;
    private Boolean isCheckedIn;
}
