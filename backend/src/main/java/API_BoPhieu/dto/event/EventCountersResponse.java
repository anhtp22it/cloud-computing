package API_BoPhieu.dto.event;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventCountersResponse {
    @JsonProperty("UPCOMING")
    private long upcoming;
    @JsonProperty("ONGOING")
    private long ongoing;
    @JsonProperty("COMPLETED")
    private long completed;
    @JsonProperty("CANCELLED")
    private long cancelled;
    @JsonProperty("MANAGE")
    private long manage;
}
