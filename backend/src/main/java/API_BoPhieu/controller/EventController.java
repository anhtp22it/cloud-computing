package API_BoPhieu.controller;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import API_BoPhieu.constants.EventStatus;
import API_BoPhieu.dto.attendant.ParticipantResponse;
import API_BoPhieu.dto.attendant.ParticipantsDto;
import API_BoPhieu.dto.event.EventDetailResponse;
import API_BoPhieu.dto.event.EventDto;
import API_BoPhieu.dto.event.EventPageWithCountersResponse;
import API_BoPhieu.dto.event.EventResponse;
import API_BoPhieu.entity.Attendant;
import API_BoPhieu.service.attendant.AttendantService;
import API_BoPhieu.service.event.EventService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/events")
@RequiredArgsConstructor
public class EventController {
    private static final Logger log = LoggerFactory.getLogger(EventController.class);

    private final EventService eventService;
    private final AttendantService attendantService;

    @PutMapping("/{id}/upload-banner")
    public ResponseEntity<?> uploadBanner(@PathVariable("id") Integer eventId,
            @RequestParam("banner") MultipartFile bannerFile) {
        EventResponse eventResponse = eventService.uploadBanner(eventId, bannerFile);
        return ResponseEntity.ok().body(eventResponse);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventDto eventDto,
            Authentication authentication) {
        EventResponse eventResponse = eventService.createEvent(eventDto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(eventResponse);
    }

    @PostMapping("/join/{eventToken}")
    public ResponseEntity<Attendant> joinEvent(@PathVariable String eventToken,
            Authentication authentication) {
        Attendant newAttendant = eventService.joinEvent(eventToken, authentication.getName());
        return ResponseEntity.ok(newAttendant);
    }

    @PostMapping("/{eventId}/participants")
    public ResponseEntity<List<ParticipantResponse>> addParticipants(@PathVariable Integer eventId,
            @RequestBody ParticipantsDto participantsDto, Authentication authentication) {
        List<ParticipantResponse> response = attendantService.addParticipants(eventId,
                participantsDto, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping(("/{eventId}/participants"))
    public ResponseEntity<?> deleteParticipants(@PathVariable Integer eventId,
            @RequestBody ParticipantsDto participantsDto, Authentication authentication) {
        String removerEmail = authentication.getName();

        attendantService.deleteParticipantsByEventIdAndUsersId(eventId, participantsDto,
                removerEmail);

        return ResponseEntity.ok(Map.of("message", "Xóa người tham gia thành công!"));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Integer eventId,
            @RequestBody EventDto eventDto) {
        EventResponse eventResponse = eventService.updateEvent(eventId, eventDto);
        return ResponseEntity.ok(eventResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDetailResponse> getEventById(@PathVariable Integer id,
            Authentication authentication) {
        EventDetailResponse eventDetailResponse = eventService.getEventById(id, authentication.getName());

        return ResponseEntity.ok(eventDetailResponse);
    }

    @GetMapping
    public ResponseEntity<EventPageWithCountersResponse> getAllEvents(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) String search, Authentication authentication) {
        log.debug(
                "API getAllEvents được gọi với các tham số: page={}, size={}, status='{}', search='{}'",
                page, size, status, search);
        String email = authentication != null ? authentication.getName() : null;

        EventPageWithCountersResponse result = eventService.getAllEvents(page, size, sortBy, sortDir, status, search,
                email);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/managed")
    public ResponseEntity<EventPageWithCountersResponse> getManagedEvents(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) String search, Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;

        EventPageWithCountersResponse result = eventService.getManagedEvents(page, size, sortBy, sortDir, status,
                search, email);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @eventAuth.isManagerOfEvent(authentication, #dto.eventId, T(API_BoPhieu.constants.EventRole).MANAGE)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        eventService.cancelEvent(id);
    }
}
