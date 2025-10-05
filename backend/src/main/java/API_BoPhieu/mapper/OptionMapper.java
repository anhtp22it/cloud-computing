package API_BoPhieu.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import API_BoPhieu.dto.poll.OptionResponse;
import API_BoPhieu.entity.Option;

public class OptionMapper {
    public static OptionResponse toOptionResponse(Option option, int voteCount) {
        OptionResponse response = new OptionResponse();
        response.setId(option.getId());
        response.setContent(option.getContent());
        response.setVoteCount(voteCount);
        return response;
    }

    public static List<OptionResponse> toOptionResponses(List<Option> options,
            Map<Integer, Integer> optionVoteCounts) {
        List<OptionResponse> responses = new ArrayList<>();
        for (Option option : options) {
            int voteCount = optionVoteCounts.getOrDefault(option.getId(), 0);
            responses.add(toOptionResponse(option, voteCount));
        }
        return responses;
    }
}
