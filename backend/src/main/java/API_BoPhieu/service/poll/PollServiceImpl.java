package API_BoPhieu.service.poll;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import API_BoPhieu.dto.poll.OptionStatsResponse;
import API_BoPhieu.dto.poll.PollDTO;
import API_BoPhieu.dto.poll.PollResponse;
import API_BoPhieu.dto.poll.PollStatsResponse;
import API_BoPhieu.dto.poll.UpdatePollDTO;
import API_BoPhieu.dto.poll.VoteDTO;
import API_BoPhieu.entity.Event;
import API_BoPhieu.entity.Option;
import API_BoPhieu.entity.Poll;
import API_BoPhieu.entity.User;
import API_BoPhieu.entity.Vote;
import API_BoPhieu.exception.AuthException;
import API_BoPhieu.exception.EventException;
import API_BoPhieu.exception.PollException;
import API_BoPhieu.mapper.PollMapper;
import API_BoPhieu.repository.EventRepository;
import API_BoPhieu.repository.OptionRepository;
import API_BoPhieu.repository.PollRepository;
import API_BoPhieu.repository.UserRepository;
import API_BoPhieu.repository.VoteRepository;
import API_BoPhieu.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PollServiceImpl implements PollService {
    @Override
    @Transactional(readOnly = true)
    public List<Integer> getVotedOptionIdsByUser(Integer pollId, Integer userId) {
        List<Vote> votes = voteRepository.findByPollIdAndUserId(pollId, userId);
        return votes.stream().map(Vote::getOptionId).collect(java.util.stream.Collectors.toList());
    }

    private final PollRepository pollRepository;
    private final EventRepository eventRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final OptionRepository optionRepository;
    private final VoteRepository voteRepository;

    @Override
    @Caching(evict = {
            @CacheEvict(cacheNames = "POLLS_BY_EVENT", key = "'event:' + #pollDTO.eventId"),
            @CacheEvict(cacheNames = "POLL_STATS", allEntries = true)})
    @Transactional
    public PollResponse createPoll(PollDTO pollDTO, String authToken) {
        authToken = authToken.replace("Bearer ", "");

        User user = userRepository.findByEmail(jwtTokenProvider.getEmail(authToken))
                .orElseThrow(() -> new AuthException("Không tìm thấy người dùng!"));

        Event event = eventRepository.findById(pollDTO.getEventId()).orElseThrow(
                () -> new EventException("Không tìm thấy sự kiện với ID: " + pollDTO.getEventId()));

        Poll poll = new Poll();
        poll.setEventId(event.getId());
        poll.setTitle(pollDTO.getTitle());
        poll.setPollType(pollDTO.getPollType());
        poll.setIsDelete(false);
        poll.setStartTime(pollDTO.getStartTime());
        poll.setEndTime(pollDTO.getEndTime());
        poll.setCreatedBy(user.getId());

        pollRepository.save(poll);

        List<Option> options = pollDTO.getOptions().stream().map(optionRequest -> {
            Option option = new Option();
            option.setPollId(poll.getId());
            option.setContent(optionRequest.getContent());
            option.setImageUrl(optionRequest.getImageUrl());
            return option;
        }).collect(Collectors.toList());
        optionRepository.saveAll(options);

        List<Option> savedOptions = optionRepository.findByPollId(poll.getId());
        Map<Integer, Integer> optionVoteCounts = new HashMap<>();
        for (Option option : savedOptions) {
            optionVoteCounts.put(option.getId(), 0);
        }
        return PollMapper.toPollResponse(poll, savedOptions, optionVoteCounts);
    }

    @Override
    // @Cacheable(cacheNames = "POLL_DETAIL", key = "'poll:' + #pollId + ':user:' + #userId")
    @Transactional(readOnly = true)
    public PollResponse getPoll(Integer pollId, Integer userId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new EventException("Không tìm thấy poll với ID: " + pollId));
        List<Option> options = optionRepository.findByPollId(pollId);
        Map<Integer, Integer> optionVoteCounts = new HashMap<>();
        for (Object[] row : voteRepository.countVotesByOptionAndPollId(pollId)) {
            Integer optionId = (Integer) row[0];
            Long count = (Long) row[1];
            optionVoteCounts.put(optionId, count != null ? count.intValue() : 0);
        }

        PollResponse response = PollMapper.toPollResponse(poll, options, optionVoteCounts);

        boolean hasVoted = voteRepository.existsByPollIdAndUserId(pollId, userId);
        response.setHasVoted(hasVoted);

        return response;
    }

    @Override
    @Cacheable(cacheNames = "POLLS_BY_EVENT", key = "'event:' + #eventId")
    @Transactional(readOnly = true)
    public List<PollResponse> getPollsByEvent(Integer eventId) {
        List<Poll> polls = pollRepository.findByEventId(eventId);
        List<PollResponse> responses = new ArrayList<>();
        for (Poll poll : polls) {
            List<Option> options = optionRepository.findByPollId(poll.getId());
            Map<Integer, Integer> optionVoteCounts = new HashMap<>();
            for (Object[] row : voteRepository.countVotesByOptionAndPollId(poll.getId())) {
                Integer optionId = (Integer) row[0];
                Long count = (Long) row[1];
                optionVoteCounts.put(optionId, count != null ? count.intValue() : 0);
            }
            responses.add(PollMapper.toPollResponse(poll, options, optionVoteCounts));
        }
        return responses;
    }

    @Override
    @Caching(evict = {@CacheEvict(cacheNames = "POLL_DETAIL", key = "'poll:' + #pollId + '*'"),
            @CacheEvict(cacheNames = "POLL_STATS", key = "'poll:' + #pollId")})
    @Transactional
    public void vote(Integer pollId, VoteDTO voteRequest, String authToken) {
        authToken = authToken.replace("Bearer ", "");
        User user = userRepository.findByEmail(jwtTokenProvider.getEmail(authToken))
                .orElseThrow(() -> new AuthException("Không tìm thấy người dùng!"));
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new EventException("Không tìm thấy poll với ID: " + pollId));
        if (poll.getIsDelete() == true) {
            throw new PollException("Poll không mở để vote!");
        }
        List<Vote> oldVotes = voteRepository.findByPollIdAndUserId(pollId, user.getId());
        if (!oldVotes.isEmpty()) {
            voteRepository.deleteAll(oldVotes);
        }
        for (Integer optionId : voteRequest.getOptionIds()) {
            API_BoPhieu.entity.Vote vote = new Vote();
            vote.setPollId(pollId);
            vote.setUserId(user.getId());
            vote.setOptionId(optionId);
            voteRepository.save(vote);
        }
    }

    @Override
    @Cacheable(cacheNames = "POLL_STATS", key = "'event:' + #eventId")
    @Transactional(readOnly = true)
    public List<PollStatsResponse> getPollStatsByEvent(Integer eventId) {
        List<Poll> polls = pollRepository.findByEventId(eventId);
        List<PollStatsResponse> statsResponses = new ArrayList<>();
        for (Poll poll : polls) {
            PollStatsResponse stats = getPollStats(poll.getId());
            statsResponses.add(stats);
        }
        return statsResponses;
    }

    @Override
    @Cacheable(cacheNames = "POLL_STATS", key = "'poll:' + #pollId")
    @Transactional(readOnly = true)
    public PollStatsResponse getPollStats(Integer pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new EventException("Không tìm thấy poll với ID: " + pollId));
        List<Option> options = optionRepository.findByPollId(pollId);
        List<Object[]> voteCounts = voteRepository.countVotesByOptionAndPollId(pollId);
        int totalVotes = voteRepository.countVotesByPollId(pollId);
        int totalVoters = voteRepository.countDistinctVotersByPollId(pollId);
        List<OptionStatsResponse> optionStats = new java.util.ArrayList<>();
        for (Option option : options) {
            int voteCount = 0;
            for (Object[] row : voteCounts) {
                Integer optionId = (Integer) row[0];
                Long count = (Long) row[1];
                if (option.getId().equals(optionId)) {
                    voteCount = count != null ? count.intValue() : 0;
                    break;
                }
            }
            double percentage = totalVotes > 0 ? (voteCount * 100.0 / totalVotes) : 0.0;
            OptionStatsResponse stat = new OptionStatsResponse();
            stat.setId(option.getId());
            stat.setContent(option.getContent());
            stat.setVoteCount(voteCount);
            stat.setPercentage(percentage);
            optionStats.add(stat);
        }
        PollStatsResponse statsResponse = new PollStatsResponse();
        statsResponse.setId(poll.getId());
        statsResponse.setTitle(poll.getTitle());
        statsResponse.setPollType(poll.getPollType());
        statsResponse.setIsDelete(poll.getIsDelete());
        statsResponse.setTotalVotes(totalVotes);
        statsResponse.setTotalVoters(totalVoters);
        statsResponse.setOptions(optionStats);
        statsResponse.setStartTime(poll.getStartTime());
        statsResponse.setEndTime(poll.getEndTime());
        return statsResponse;
    }

    @Override
    @Caching(evict = {@CacheEvict(cacheNames = "POLL_DETAIL", allEntries = true),
            @CacheEvict(cacheNames = "POLLS_BY_EVENT", allEntries = true),
            @CacheEvict(cacheNames = "POLL_STATS", allEntries = true)})
    @Transactional
    public PollResponse closePoll(Integer pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new EventException("Không tìm thấy poll với ID: " + pollId));
        poll.setIsDelete(true);
        pollRepository.save(poll);
        List<Option> options = optionRepository.findByPollId(pollId);
        Map<Integer, Integer> optionVoteCounts = new HashMap<>();
        for (Object[] row : voteRepository.countVotesByOptionAndPollId(pollId)) {
            Integer optionId = (Integer) row[0];
            Long count = (Long) row[1];
            optionVoteCounts.put(optionId, count != null ? count.intValue() : 0);
        }
        return PollMapper.toPollResponse(poll, options, optionVoteCounts);
    }

    @Override
    @Caching(evict = {@CacheEvict(cacheNames = "POLL_DETAIL", allEntries = true),
            @CacheEvict(cacheNames = "POLLS_BY_EVENT", allEntries = true),
            @CacheEvict(cacheNames = "POLL_STATS", allEntries = true)})
    @Transactional
    public PollResponse updatePoll(UpdatePollDTO pollDto, Integer pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new EventException("Không tìm thấy poll với ID: " + pollId));
        poll.setTitle(pollDto.getTitle());
        poll.setPollType(pollDto.getPollType());
        poll.setStartTime(pollDto.getStartTime());
        poll.setEndTime(pollDto.getEndTime());

        pollRepository.save(poll);
        List<Option> options = pollDto.getOptions().stream().map(optionRequest -> {
            Option option = optionRepository.findById(optionRequest.getOptionId())
                    .orElseThrow(() -> new EventException(
                            "Không tìm thấy option với ID: " + optionRequest.getOptionId()));
            option.setPollId(poll.getId());
            option.setContent(optionRequest.getContent());
            return option;
        }).collect(Collectors.toList());
        optionRepository.saveAll(options);
        List<Option> savedOptions = optionRepository.findByPollId(poll.getId());
        Map<Integer, Integer> optionVoteCounts = new HashMap<>();
        for (Option option : savedOptions) {
            optionVoteCounts.put(option.getId(), 0);
        }
        return PollMapper.toPollResponse(poll, savedOptions, optionVoteCounts);

    }

}
