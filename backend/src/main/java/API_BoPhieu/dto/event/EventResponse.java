package API_BoPhieu.dto.event;

import java.time.Instant;

import API_BoPhieu.constants.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Integer id;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private String location;
    private EventStatus status;
    private String banner;
    private String urlDocs;
    private Integer createdBy;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private Instant updatedAt;
    private String qrJoinToken;
    private Boolean isRegistered = false;
    private Instant createdAt;

    private Integer createdById;
    private String createdByName;
    private Integer managerId;
    private String managerName;
}