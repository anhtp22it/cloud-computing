package API_BoPhieu.service.sse;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseService {
    void addEmitter(Integer eventId, SseEmitter emitter);

    void sendEventToClients(Integer eventId, String eventName, Object data);
}
