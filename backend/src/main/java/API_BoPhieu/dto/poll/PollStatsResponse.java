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
public class PollStatsResponse {
    private Integer id;
    private String title;
    private PollType pollType;
    private Boolean isDelete;
    private Integer totalVotes;
    private Integer totalVoters;
    private List<OptionStatsResponse> options;
    private Instant startTime;
    private Instant endTime;
}
