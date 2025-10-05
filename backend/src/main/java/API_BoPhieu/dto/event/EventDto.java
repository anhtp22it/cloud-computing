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
public class EventDto {
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private String location;
    private Integer maxParticipants;
    private String urlDocs;
}
