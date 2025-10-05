package API_BoPhieu.scheduler;

import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import API_BoPhieu.repository.EventRepository;
import jakarta.transaction.Transactional;

@Component
public class EventStatusScheduler {

    private static final Logger LOG = LoggerFactory.getLogger(EventStatusScheduler.class);

    @Autowired
    private EventRepository eventRepository;

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void updateEventStatuses() {
        LOG.info("[CRON JOB] Đang chạy công việc cập nhật trạng thái sự kiện...");
        Instant now = Instant.now();

        try {
            int toOngoingCount = eventRepository.updateUpcomingToOngoing(now);
            if (toOngoingCount > 0) {
                LOG.info("[CRON JOB] Đã cập nhật {} sự kiện từ SẮP DIỄN RA thành ĐANG DIỄN RA.", toOngoingCount);
            }

            int toCompletedCount = eventRepository.updateOngoingToCompleted(now);
            if (toCompletedCount > 0) {
                LOG.info("[CRON JOB] Đã cập nhật {} sự kiện từ ĐANG DIỄN RA thành ĐÃ HOÀN THÀNH.", toCompletedCount);
            }
        } catch (Exception e) {
            LOG.error("[CRON JOB] Lỗi trong quá trình cập nhật trạng thái sự kiện", e);
        }
    }
}
