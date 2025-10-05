package API_BoPhieu.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import API_BoPhieu.dto.attendant.ParticipantResponse;
import API_BoPhieu.entity.Attendant;
import API_BoPhieu.service.attendant.AttendantService;
import API_BoPhieu.service.sse.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/attendants")
@RequiredArgsConstructor
@Slf4j
public class AttendantController {

    private final AttendantService attendantService;
    private final SseService sseService;

    @GetMapping("/subscribe/{eventId}")
    public SseEmitter subscribeToEvents(@PathVariable Integer eventId) {
        log.info("Client mới yêu cầu kết nối SSE tới sự kiện ID: {}", eventId);

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        sseService.addEmitter(eventId, emitter);

        try {
            emitter.send(SseEmitter.event().name("INIT")
                    .data("Kết nối SSE thành công tới sự kiện " + eventId));
        } catch (IOException e) {
            log.warn("Không thể gửi sự kiện INIT tới client cho sự kiện ID {}: {}", eventId,
                    e.getMessage());
        }

        log.debug("Đã trả về emitter cho client của sự kiện ID {}", eventId);
        return emitter;
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @eventAuth.hasEventRole(authentication, #eventId, T(API_BoPhieu.constants.EventRole).STAFF)")
    public ResponseEntity<List<ParticipantResponse>> getParticipantsByEventId(
            @PathVariable Integer eventId) {
        log.debug("Nhận yêu cầu lấy danh sách người tham gia cho sự kiện ID: {}", eventId);
        List<ParticipantResponse> responses = attendantService.getParticipantByEventId(eventId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/check-in/{eventToken}")
    public ResponseEntity<Attendant> checkInEvent(@PathVariable String eventToken,
            Authentication authentication) {
        log.info("Nhận yêu cầu check-in từ người dùng '{}' cho sự kiện với token '{}'",
                authentication.getName(), eventToken);
        Attendant attendant = attendantService.checkIn(eventToken, authentication.getName());
        return ResponseEntity.ok(attendant);
    }

    @GetMapping("/get-qr-check/{eventId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @eventAuth.hasEventRole(authentication, #eventId, T(API_BoPhieu.constants.EventRole).STAFF)")
    public ResponseEntity<byte[]> getQrCheck(@PathVariable Integer eventId) throws Exception {
        log.debug("Nhận yêu cầu tạo QR check-in cho sự kiện ID: {}", eventId);
        byte[] qrCodeImage = attendantService.generateQrCheck(eventId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(qrCodeImage.length);
        return new ResponseEntity<>(qrCodeImage, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{eventId}/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @eventAuth.hasEventRole(authentication, #eventId, T(API_BoPhieu.constants.EventRole).STAFF)")
    public ResponseEntity<Map<String, String>> deleteParticipant(@PathVariable Integer eventId,
            @PathVariable Integer userId, Authentication authentication) {
        log.info("Người dùng '{}' yêu cầu xóa user ID {} khỏi sự kiện ID {}",
                authentication.getName(), userId, eventId);
        attendantService.deleteParticipantByEventIdAndUserId(eventId, userId);
        return ResponseEntity.ok(Map.of("message", "Xóa người tham gia thành công"));
    }

    @DeleteMapping("/my-registration/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> cancelMyRegistration(@PathVariable Integer eventId,
            Authentication authentication) {

        log.info("Người dùng '{}' yêu cầu tự hủy đăng ký khỏi sự kiện ID {}",
                authentication.getName(), eventId);
        attendantService.cancelMyRegistration(eventId, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Hủy đăng ký thành công."));
    }
}
