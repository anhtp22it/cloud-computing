package API_BoPhieu.service.event_manager;

import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import API_BoPhieu.constants.EventManagement;
import API_BoPhieu.dto.event_managers.EventManagerDto;
import API_BoPhieu.dto.event_managers.EventManagerResponse;
import API_BoPhieu.entity.Event;
import API_BoPhieu.entity.EventManager;
import API_BoPhieu.entity.User;
import API_BoPhieu.exception.ConflictException;
import API_BoPhieu.exception.NotFoundException;
import API_BoPhieu.mapper.EventManagerMapper;
import API_BoPhieu.repository.EventManagerRepository;
import API_BoPhieu.repository.EventRepository;
import API_BoPhieu.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventManagerServiceImpl implements EventManagerService {
    private static final Logger log = LoggerFactory.getLogger(EventManagerServiceImpl.class);

    private final EventManagerRepository eventManagerRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventManagerMapper eventManagerMapper;

    @Override
    @Transactional
    @Caching(evict = {@CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
            @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
            @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)})
    public EventManagerResponse assignEventManager(EventManagerDto dto, String assignerEmail) {
        log.debug("Bắt đầu gán vai trò '{}' cho user ID {} vào sự kiện ID {}", dto.getRoleType(),
                dto.getUserId(), dto.getEventId());

        User assigner = userRepository.findByEmail(assignerEmail)
                .orElseThrow(() -> new NotFoundException("Người thực hiện không tồn tại."));

        Event event = eventRepository.findById(dto.getEventId()).orElseThrow(() -> {
            log.warn("Gán vai trò thất bại: Không tìm thấy sự kiện ID {}", dto.getEventId());
            return new NotFoundException("Sự kiện không tồn tại với ID: " + dto.getEventId());
        });

        userRepository.findById(dto.getUserId()).orElseThrow(() -> {
            log.warn("Gán vai trò thất bại: Không tìm thấy người dùng được gán có ID {}",
                    dto.getUserId());
            return new NotFoundException(
                    "Người dùng được gán không tồn tại với ID: " + dto.getUserId());
        });

        if (dto.getRoleType() == EventManagement.MANAGE && eventManagerRepository
                .existsByEventIdAndRoleType(dto.getEventId(), EventManagement.MANAGE)) {
            log.warn("Gán vai trò MANAGE thất bại cho sự kiện ID {}: Sự kiện đã có quản lý.",
                    dto.getEventId());
            throw new ConflictException("Sự kiện đã có quản lý, chỉ cho phép 1 MANAGE!");
        }

        checkTimeConflict(dto.getUserId(), event.getStartTime(), event.getEndTime());

        EventManager eventManager = eventManagerMapper.toEntity(dto);
        eventManager.setAssignedby(assigner.getId());
        eventManager = eventManagerRepository.save(eventManager);

        log.info(
                "Người dùng '{}' (ID: {}) đã gán thành công vai trò '{}' cho user ID {} vào sự kiện '{}' (ID: {})",
                assignerEmail, assigner.getId(), dto.getRoleType(), dto.getUserId(),
                event.getTitle(), event.getId());

        return eventManagerMapper.toResponse(eventManager);
    }

    private void checkTimeConflict(Integer userId, Instant newStartTime, Instant newEndTime) {
        List<EventManager> existingAssignments = eventManagerRepository.findByUserId(userId);
        for (EventManager em : existingAssignments) {
            eventRepository.findById(em.getEventId()).ifPresent(existingEvent -> {
                if (newStartTime.isBefore(existingEvent.getEndTime())
                        && newEndTime.isAfter(existingEvent.getStartTime())) {
                    log.warn(
                            "Phát hiện xung đột thời gian cho user ID {} khi gán vào sự kiện mới. Xung đột với sự kiện ID {}",
                            userId, existingEvent.getId());
                    throw new ConflictException(String.format(
                            "Người này đã được gán cho sự kiện '%s' trong khoảng thời gian bị trùng!",
                            existingEvent.getTitle()));
                }
            });
        }
    }

    @Override
    @Transactional
    @Caching(evict = {@CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
            @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
            @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)})
    public String removeEventManager(EventManagerDto dto, String removerEmail) {
        log.debug("Bắt đầu xóa vai trò '{}' của user ID {} khỏi sự kiện ID {}", dto.getRoleType(),
                dto.getUserId(), dto.getEventId());

        EventManager eventManager = eventManagerRepository
                .findByUserIdAndEventId(dto.getUserId(), dto.getEventId()).orElseThrow(() -> {
                    log.warn(
                            "Xóa vai trò thất bại: Không tìm thấy vai trò cho user ID {} trong sự kiện ID {}",
                            dto.getUserId(), dto.getEventId());
                    return new NotFoundException(
                            "Không tìm thấy vai trò cho người dùng này trong sự kiện.");
                });

        eventManagerRepository.delete(eventManager);

        log.info("Người dùng '{}' đã xóa thành công vai trò của user ID {} khỏi sự kiện ID {}",
                removerEmail, dto.getUserId(), dto.getEventId());
        return "Đã xóa vai trò thành công!";
    }

    @Override
    public List<EventManagerDto> findByEventId(Integer eventId) {
        List<EventManager> managers = eventManagerRepository.findByEventId(eventId);
        List<EventManagerDto> dtos = new java.util.ArrayList<>();
        for (EventManager m : managers) {
            EventManagerDto dto = new EventManagerDto();
            dto.setEventId(m.getEventId());
            dto.setUserId(m.getUserId());
            dto.setRoleType(m.getRoleType());
            dtos.add(dto);
        }
        return dtos;
    }
}
