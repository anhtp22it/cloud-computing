package API_BoPhieu.service.sse;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class SseServiceImpl implements SseService {
    private static final Logger log = LoggerFactory.getLogger(SseServiceImpl.class);
    private final Map<Integer, List<SseEmitter>> EMMITTERS_BY_EVENT_ID = new ConcurrentHashMap<>();

    @Override
    public void addEmitter(Integer eventId, SseEmitter emitter) {
        List<SseEmitter> emitters = this.EMMITTERS_BY_EVENT_ID.computeIfAbsent(eventId,
                k -> new CopyOnWriteArrayList<>());
        emitters.add(emitter);
        log.info("SSE: Client mới đã kết nối tới sự kiện ID {}. Tổng số client: {}", eventId, emitters.size());

        emitter.onCompletion(() -> removeEmitter(eventId, emitter, "COMPLETED"));
        emitter.onTimeout(() -> removeEmitter(eventId, emitter, "TIMED_OUT"));
        emitter.onError(e -> removeEmitter(eventId, emitter, "ERROR"));
    }

    private void removeEmitter(Integer eventId, SseEmitter emitter, String reason) {
        List<SseEmitter> emitters = this.EMMITTERS_BY_EVENT_ID.get(eventId);
        if (emitters != null) {
            emitters.remove(emitter);
            log.info("SSE: Client đã ngắt kết nối khỏi sự kiện ID {} vì lý do: {}. Số client còn lại: {}", eventId,
                    reason, emitters.size());
        }
    }

    @Override
    public void sendEventToClients(Integer eventId, String eventName, Object data) {
        List<SseEmitter> emitters = this.EMMITTERS_BY_EVENT_ID.get(eventId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }
        log.debug("SSE: Gửi sự kiện '{}' đến {} client của sự kiện ID {}", eventName, emitters.size(), eventId);

        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                log.warn("SSE: Không thể gửi sự kiện đến một client, đánh dấu để xóa. Sự kiện ID {}", eventId);
                deadEmitters.add(emitter);
            }
        });

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            log.info("SSE: Đã xóa {} client không hoạt động khỏi sự kiện ID {}", deadEmitters.size(), eventId);
        }
    }
}
