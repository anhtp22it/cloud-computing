package API_BoPhieu.service.poll;

import java.util.List;

import API_BoPhieu.dto.poll.PollDTO;
import API_BoPhieu.dto.poll.PollResponse;
import API_BoPhieu.dto.poll.PollStatsResponse;
import API_BoPhieu.dto.poll.UpdatePollDTO;
import API_BoPhieu.dto.poll.VoteDTO;

public interface PollService {
    List<Integer> getVotedOptionIdsByUser(Integer pollId, Integer userId);

    PollResponse createPoll(PollDTO pollDTO, String authToken);

    PollResponse getPoll(Integer pollId, Integer userId);

    List<PollResponse> getPollsByEvent(Integer eventId);

    void vote(Integer pollId, VoteDTO voteRequest, String authToken);

    PollStatsResponse getPollStats(Integer pollId);

    PollResponse closePoll(Integer pollId);

    PollResponse updatePoll(UpdatePollDTO pollDto, Integer pollId);

    List<PollStatsResponse> getPollStatsByEvent(Integer eventId);
}