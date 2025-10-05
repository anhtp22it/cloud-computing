package API_BoPhieu.dto.poll;

import java.time.Instant;
import java.util.List;
import API_BoPhieu.constants.PollType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollDTO {
    private Integer eventId;
    private String title;
    private PollType pollType;
    private Instant startTime;
    private Instant endTime;
    private List<OptionDTO> options;
}
