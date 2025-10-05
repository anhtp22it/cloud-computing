
package API_BoPhieu.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import API_BoPhieu.dto.poll.PollDTO;
import API_BoPhieu.dto.poll.PollResponse;
import API_BoPhieu.dto.poll.PollStatsResponse;
import API_BoPhieu.dto.poll.UpdatePollDTO;
import API_BoPhieu.dto.poll.VoteDTO;
import API_BoPhieu.entity.User;
import API_BoPhieu.exception.AuthException;
import API_BoPhieu.repository.UserRepository;
import API_BoPhieu.service.poll.PollService;

@RestController
@RequestMapping("${api.prefix}/polls")
public class PollController {

    @Autowired
    private PollService pollService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<PollResponse> createPoll(@RequestBody PollDTO pollDTO,
            @RequestHeader("Authorization") String token) {
        PollResponse pollResponse = pollService.createPoll(pollDTO, token);
        return ResponseEntity.ok(pollResponse);
    }

    @GetMapping("/{pollId}")
    public ResponseEntity<PollResponse> getPoll(@PathVariable Integer pollId,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AuthException("Không tìm thấy user"));
        PollResponse pollResponse = pollService.getPoll(pollId, user.getId());
        return ResponseEntity.ok(pollResponse);
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<PollResponse>> getPollsByEvent(@PathVariable Integer eventId) {
        List<PollResponse> pollResponses = pollService.getPollsByEvent(eventId);
        return ResponseEntity.ok(pollResponses);
    }

    @PostMapping("/{pollId}/vote")
    public ResponseEntity<?> votePoll(@PathVariable Integer pollId, @RequestBody VoteDTO voteDTO,
            @RequestHeader("Authorization") String token) {
        try {
            pollService.vote(pollId, voteDTO, token);
            return ResponseEntity
                    .ok(Map.of("message", "Bạn đã vote thành công cho poll ID: " + pollId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{pollId}/my-options")
    public ResponseEntity<?> getMyVotedOptions(@PathVariable Integer pollId,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AuthException("Không tìm thấy user"));
        List<Integer> optionIds = pollService.getVotedOptionIdsByUser(pollId, user.getId());
        return ResponseEntity.ok(Map.of("optionIds", optionIds));
    }

    @GetMapping("/{eventId}/stats")
    public ResponseEntity<List<PollStatsResponse>> getPollStatsByEvent(
            @PathVariable Integer eventId) {
        List<PollStatsResponse> pollStatsResponses = pollService.getPollStatsByEvent(eventId);
        return ResponseEntity.ok(pollStatsResponses);
    }

    @PutMapping("/{pollId}/close")
    public ResponseEntity<PollResponse> closePoll(@PathVariable Integer pollId) {
        PollResponse pollResponse = pollService.closePoll(pollId);
        return ResponseEntity.ok(pollResponse);
    }

    @PutMapping("/{pollId}")
    public ResponseEntity<PollResponse> updatePoll(@PathVariable Integer pollId,
            @RequestBody UpdatePollDTO updatePollDTO) {
        PollResponse poll = pollService.updatePoll(updatePollDTO, pollId);

        return ResponseEntity.ok(poll);
    }

}
