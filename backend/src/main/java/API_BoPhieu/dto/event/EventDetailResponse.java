package API_BoPhieu.dto.event;

import java.time.Instant;
import java.util.List;

import API_BoPhieu.constants.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDetailResponse {
    private Integer id;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private String location;
    private Integer createBy;
    private EventStatus status;
    private String banner;
    private String urlDocs;
    private Integer maxParticipants;
    private String qrJoinToken;
    private Instant createdAt;
    private Instant updatedAt;

    private Boolean isUserRegistered;
    private List<ParticipantInfo> participants;
    private List<ManagerInfo> manager;
    private List<SecretaryInfo> secretaries;
}
