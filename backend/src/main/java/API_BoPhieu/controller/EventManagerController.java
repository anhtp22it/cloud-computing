package API_BoPhieu.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import API_BoPhieu.dto.event_managers.EventManagerDto;
import API_BoPhieu.dto.event_managers.EventManagerResponse;
import API_BoPhieu.service.event_manager.EventManagerService;

@RestController
@RequestMapping("${api.prefix}/event-manager")
public class EventManagerController {
    private static final Logger log = LoggerFactory.getLogger(EventManagerController.class);

    @Autowired
    private EventManagerService eventManagerService;

    @PostMapping("/assign-manager")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @eventAuth.hasEventRole(authentication,#dto.eventId, T(API_BoPhieu.constants.EventRole).MANAGE)")
    public ResponseEntity<EventManagerResponse> assignEventManager(@RequestBody EventManagerDto dto,
            Authentication authentication) {
        log.info("Nhận yêu cầu gán vai trò từ người dùng '{}'", authentication.getName());
        EventManagerResponse response = eventManagerService.assignEventManager(dto, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event-managers")
    public ResponseEntity<List<EventManagerDto>> getEventManagersByEventId(@RequestParam Integer eventId) {
        log.debug("Nhận yêu cầu lấy danh sách quản lý cho sự kiện ID: {}", eventId);
        List<EventManagerDto> managers = eventManagerService.findByEventId(eventId);
        return ResponseEntity.ok(managers);
    }

    @DeleteMapping("/remove-manager")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @eventAuth.hasEventRole(authentication,#dto.eventId, T(API_BoPhieu.constants.EventRole).MANAGE)")
    public ResponseEntity<Map<String, String>> removeEventManager(@RequestBody EventManagerDto dto,
            Authentication authentication) {
        log.info("Nhận yêu cầu xóa vai trò từ người dùng '{}'", authentication.getName());
        String result = eventManagerService.removeEventManager(dto, authentication.getName());
        return ResponseEntity.ok(Map.of("message", result));
    }
}