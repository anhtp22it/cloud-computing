package API_BoPhieu.dto.event;

import API_BoPhieu.dto.common.PageResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventPageWithCountersResponse {
    private PageResponse<EventResponse> pagination;
    private EventCountersResponse counters;
}
