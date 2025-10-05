package API_BoPhieu.dto.poll;

import java.time.Instant;
import java.util.List;
import API_BoPhieu.constants.PollType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePollDTO {
    private Integer eventId;
    private String title;
    private PollType pollType;
    private Instant startTime;
    private Instant endTime;
    private List<UpdateOptionDTO> options;
}
