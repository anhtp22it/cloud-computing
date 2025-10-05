package API_BoPhieu.mapper;

import java.util.List;
import java.util.Map;

import API_BoPhieu.dto.poll.PollResponse;
import API_BoPhieu.entity.Poll;
import API_BoPhieu.entity.Option;

public class PollMapper {
    public static PollResponse toPollResponse(Poll poll, List<Option> options,
            Map<Integer, Integer> optionVoteCounts) {
        PollResponse response = new PollResponse();
        response.setId(poll.getId());
        response.setEventId(poll.getEventId());
        response.setTitle(poll.getTitle());
        response.setPollType(poll.getPollType());
        response.setStartTime(poll.getStartTime());
        response.setEndTime(poll.getEndTime());
        response.setIsDelete(poll.getIsDelete());
        response.setOptions(OptionMapper.toOptionResponses(options, optionVoteCounts));
        response.setCreatedAt(poll.getCreatedAt());
        response.setUpdatedAt(poll.getUpdatedAt());
        return response;
    }
}
