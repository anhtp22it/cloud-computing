package API_BoPhieu.service.event;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import API_BoPhieu.constants.EventManagement;
import API_BoPhieu.constants.EventStatus;
import API_BoPhieu.dto.common.PageResponse;
import API_BoPhieu.dto.event.EventCountersResponse;
import API_BoPhieu.dto.event.EventDetailResponse;
import API_BoPhieu.dto.event.EventDto;
import API_BoPhieu.dto.event.EventPageWithCountersResponse;
import API_BoPhieu.dto.event.EventResponse;
import API_BoPhieu.dto.event.ManagerInfo;
import API_BoPhieu.dto.event.ParticipantInfo;
import API_BoPhieu.dto.event.SecretaryInfo;
import API_BoPhieu.entity.Attendant;
import API_BoPhieu.entity.Event;
import API_BoPhieu.entity.EventManager;
import API_BoPhieu.entity.User;
import API_BoPhieu.exception.AuthException;
import API_BoPhieu.exception.EventException;
import API_BoPhieu.exception.NotFoundException;
import API_BoPhieu.mapper.EventMapper;
import API_BoPhieu.repository.AttendantRepository;
import API_BoPhieu.repository.EventManagerRepository;
import API_BoPhieu.repository.EventRepository;
import API_BoPhieu.repository.UserRepository;
import API_BoPhieu.service.attendant.QRCodeService;
import API_BoPhieu.service.file.FileStorageService;
import API_BoPhieu.service.file.FileStorageServiceImpl;
import API_BoPhieu.specification.EventSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventServiceImpl implements EventService {
    private static final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final FileStorageService fileStorageService;
    private final AttendantRepository attendantRepository;
    private final QRCodeService qrCodeService;
    private final UserRepository userRepository;
    private final EventManagerRepository eventManagerRepository;

    @Override
    @Transactional
    // @Caching(evict = {
    // @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
    // @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
    // @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)
    // })
    public EventResponse createEvent(EventDto eventDto, String creatorEmail) {
        User user = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new AuthException("Người dùng không hợp lệ!"));

        Event newEvent = eventMapper.toEntity(eventDto);
        newEvent.setQrJoinToken(qrCodeService.generateQRToken());
        newEvent.setCreateBy(user.getId());
        newEvent = eventRepository.save(newEvent);

        log.info("Sự kiện '{}' đã được tạo bởi người dùng '{}'", newEvent.getTitle(), creatorEmail);

        EventResponse eventResponse = eventMapper.toEventResponse(newEvent);
        eventResponse.setCurrentParticipants(0);
        return eventResponse;
    }

    @Override
    // @Caching(evict = {
    // @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
    // @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true),
    // @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true)
    // })
    @Transactional
    public EventResponse updateEvent(Integer eventId, EventDto eventDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("Người dùng không hợp lệ!"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventException("Không tìm thấy sự kiện!"));

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

        boolean isManager = eventManagerRepository.findByUserIdAndEventId(user.getId(), eventId)
                .map(manager -> manager.getRoleType() == EventManagement.MANAGE).orElse(false);

        if (!isAdmin && !isManager) {
            throw new EventException("Bạn không có quyền sửa sự kiện này");
        }

        log.debug("Bắt đầu cập nhật sự kiện ID: {} với dữ liệu DTO", eventId);

        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setStartTime(eventDto.getStartTime());
        event.setEndTime(eventDto.getEndTime());
        event.setLocation(eventDto.getLocation());
        event.setMaxParticipants(eventDto.getMaxParticipants());
        event.setUrlDocs(eventDto.getUrlDocs());
        event = eventRepository.save(event);

        EventResponse eventResponse = eventMapper.toEventResponse(event);

        return eventResponse;
    }

    @Override
    @Transactional
    // @Caching(evict = {
    // @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
    // @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
    // @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)
    // })
    public EventResponse uploadBanner(Integer eventId, MultipartFile file) {
        log.info("Bắt đầu quá trình upload banner cho sự kiện ID: {}", eventId);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy sự kiện!"));

        if (event.getBanner() != null && !event.getBanner().isEmpty()) {
            fileStorageService.deleteFile("banners", event.getBanner());
            log.debug("Đã xóa banner cũ thành công: {}", event.getBanner());
        }

        String uniqueFilename = fileStorageService.storeFile(file, "banners", "banner_event_" + eventId);

        event.setBanner(uniqueFilename);
        event = eventRepository.save(event);

        log.info("Upload và cập nhật banner thành công cho sự kiện ID {}. Tên file banner mới: {}", eventId,
                uniqueFilename);

        EventResponse eventResponse = eventMapper.toEventResponse(event);
        eventResponse.setCurrentParticipants(attendantRepository.countByEventId(eventId));
        return eventResponse;
    }

    @Override
    // @Cacheable(cacheNames = "QR_IMAGE", key = "'join:' + #eventId")
    public byte[] generateEventQRCode(Integer eventId, String baseUrl, String creatorEmail)
            throws Exception {
        User user = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new AuthException("Người dùng không hợp lệ!"));

        if (eventManagerRepository.findByUserIdAndEventId(user.getId(), eventId).isEmpty()) {
            throw new AuthException("Bạn không có quyền tạo mã QR cho sự kiện này");
        }

        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new EventException("Không tìm thấy sự kiện với id = " + eventId));
        String joinUrl = baseUrl + "/events/join/" + event.getQrJoinToken();
        return qrCodeService.generateQRCode(joinUrl);
    }

    @Override
    @Transactional
    public Attendant joinEvent(String eventToken, String creatorEmail) {
        User user = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new AuthException("Người dùng không hợp lệ!"));

        Event event = eventRepository.findByQrJoinToken(eventToken).orElseThrow(
                () -> new EventException("Không tìm thấy sự kiện với token = " + eventToken));

        if (attendantRepository.existsByUserIdAndEventId(event.getId(), user.getId())) {
            throw new EventException("Bạn đã tham gia sự kiện này rồi");
        }

        Integer currentParticipants = attendantRepository.countByEventId(event.getId());
        if (event.getMaxParticipants() != null
                && currentParticipants >= event.getMaxParticipants()) {
            throw new EventException("Sự kiện đã đầy");
        }

        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new EventException("Sự kiện không còn khả dụng để tham gia");
        }

        Attendant newAttendant = new Attendant();
        newAttendant.setEventId(event.getId());
        newAttendant.setUserId(user.getId());

        log.info("Người dùng '{}' đã tham gia sự kiện '{}'", user.getEmail(), event.getTitle());
        return attendantRepository.save(newAttendant);
    }

    @Override
    // @Cacheable(cacheNames = "EVENT_DETAIL", key = "'event:' + #eventId + ':user:'
    // + #email")
    public EventDetailResponse getEventById(Integer eventId, String email) {
        log.info("Bắt đầu lấy chi tiết sự kiện ID: {} cho người dùng '{}'", eventId, email);

        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new EventException("Không tìm thấy sự kiện với id = " + eventId));
        User currentUser = userRepository.findByEmail(email).orElseThrow(
                () -> new AuthException("Không thể tìm thấy người dùng với email: " + email));

        List<Attendant> attendants = attendantRepository.findByEventId(eventId);
        List<EventManager> eventManagers = eventManagerRepository.findByEventId(eventId);

        log.debug("Đã tìm thấy {} người tham gia và {} quản lý cho sự kiện ID: {}",
                attendants.size(), eventManagers.size(), eventId);

        Set<Integer> userIds = attendants.stream().map(Attendant::getUserId).collect(Collectors.toSet());
        eventManagers.forEach(em -> userIds.add(em.getUserId()));

        log.debug("Thực hiện truy vấn hàng loạt cho {} user ID.", userIds.size());

        final Map<Integer, User> userMap = userIds.isEmpty() ? Map.of()
                : userRepository.findAllById(new ArrayList<>(userIds)).stream()
                        .collect(Collectors.toMap(User::getId, user -> user));

        boolean isUserRegistered = attendants.stream().anyMatch(a -> a.getUserId().equals(currentUser.getId()));

        List<ParticipantInfo> participants = attendants.stream().map(
                attendant -> mapToParticipantInfo(attendant, userMap.get(attendant.getUserId())))
                .collect(Collectors.toList());

        List<ManagerInfo> managerInfos = eventManagers.stream()
                .filter(em -> em.getRoleType() == EventManagement.MANAGE)
                .map(manager -> mapToManagerInfo(userMap.get(manager.getUserId())))
                .collect(Collectors.toList());

        List<SecretaryInfo> secretaryInfos = eventManagers.stream()
                .filter(em -> em.getRoleType() == EventManagement.STAFF)
                .map(secretary -> mapToSecretaryInfo(userMap.get(secretary.getUserId())))
                .collect(Collectors.toList());

        EventDetailResponse response = eventMapper.toEventDetailResponse(event, isUserRegistered, participants,
                managerInfos, secretaryInfos);

        if (event.getBanner() != null && !event.getBanner().isEmpty()) {
            String bannerUrl = ((FileStorageServiceImpl) fileStorageService).getSignedUrl("banners",
                    event.getBanner());
            response.setBanner(bannerUrl);
        }

        return response;
    }

    @Override
    // @Cacheable(cacheNames = "EVENT_LIST", keyGenerator = "listKeyGen")
    public EventPageWithCountersResponse getAllEvents(int page, int size, String sortBy,
            String sortDir, EventStatus status, String search, String email) {

        Optional<User> userOptional = (email != null && !email.isBlank()) ? userRepository.findByEmail(email)
                : Optional.empty();

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Event> spec = Specification.where(EventSpecification.hasStatus(status))
                .and(EventSpecification.searchByKeyword(search));

        Page<Event> eventPage = eventRepository.findAll(spec, pageable);
        PageResponse<EventResponse> pageResponse = createPageResponse(eventPage, userOptional);

        EventCountersResponse counters = createCountersResponse(userOptional);

        return EventPageWithCountersResponse.builder().pagination(pageResponse).counters(counters)
                .build();
    }

    @Override
    @Transactional
    // @Caching(evict = {
    // @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
    // @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
    // @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)
    // })
    public void cancelEvent(Integer id) {
        log.debug("Nhận yêu cầu hủy sự kiện với ID: {}", id);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventException("Không tìm thấy sự kiện với ID: " + id));
        event.setStatus(EventStatus.CANCELLED);
        eventRepository.save(event);
        log.info("Sự kiện '{}' (ID: {}) đã được hủy.", event.getTitle(), id);
    }

    @Override
    // @Cacheable(cacheNames = "MANAGED_EVENTS", keyGenerator = "listKeyGen")
    public EventPageWithCountersResponse getManagedEvents(int page, int size, String sortBy,
            String sortDir, EventStatus status, String search, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new AuthException("Không tìm thấy người dùng với email: " + email));

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Event> spec = Specification
                .where(EventSpecification.isManagedByUserExists(user.getId()))
                .and(EventSpecification.isNotCancelled()).and(EventSpecification.hasStatus(status))
                .and(EventSpecification.searchByKeyword(search));

        Page<Event> eventPage = eventRepository.findAll(spec, pageable);

        PageResponse<EventResponse> pageResponse = createPageResponse(eventPage, Optional.of(user));
        EventCountersResponse counters = createCountersResponse(Optional.of(user));

        return EventPageWithCountersResponse.builder().pagination(pageResponse).counters(counters)
                .build();
    }

    private ManagerInfo mapToManagerInfo(User user) {
        if (user == null)
            return new ManagerInfo();
        return ManagerInfo.builder().userId(user.getId()).userName(user.getName())
                .userEmail(user.getEmail()).build();
    }

    private SecretaryInfo mapToSecretaryInfo(User user) {
        if (user == null)
            return new SecretaryInfo();
        return SecretaryInfo.builder().userId(user.getId()).userName(user.getName())
                .userEmail(user.getEmail()).build();
    }

    private ParticipantInfo mapToParticipantInfo(Attendant attendant, User user) {
        return ParticipantInfo.builder().userId(attendant.getUserId())
                .userName(user != null ? user.getName() : "Unknown User")
                .userEmail(user != null ? user.getEmail() : "unknown.email@example.com")
                .joinedAt(attendant.getJoinedAt()).checkedTime(attendant.getCheckedTime())
                .isCheckedIn(attendant.getCheckedTime() != null).build();
    }

    private PageResponse<EventResponse> createPageResponse(Page<Event> eventPage,
            Optional<User> userOptional) {
        if (eventPage.isEmpty()) {
            return new PageResponse<>(Page.empty());
        }

        List<Event> events = eventPage.getContent();
        List<Integer> eventIds = events.stream().map(Event::getId).collect(Collectors.toList());

        Set<Integer> creatorIds = events.stream().map(Event::getCreateBy).collect(Collectors.toSet());
        List<EventManager> allManagersOnPage = eventManagerRepository.findAllByEventIdIn(eventIds);
        Set<Integer> managerUserIds = allManagersOnPage.stream().map(EventManager::getUserId)
                .collect(Collectors.toSet());

        Set<Integer> allUserIdsToFetch = new HashSet<>(creatorIds);
        allUserIdsToFetch.addAll(managerUserIds);

        Map<Integer, User> userMap = userRepository.findAllById(allUserIdsToFetch).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        Map<Integer, Long> participantCounts = attendantRepository
                .countParticipantsByEventIds(eventIds).stream().collect(Collectors
                        .toMap(result -> (Integer) result[0], result -> (Long) result[1]));

        Set<Integer> registeredEventIds = userOptional.map(
                user -> attendantRepository.findRegisteredEventIdsByUserId(user.getId(), eventIds))
                .orElse(Collections.emptySet());

        Page<EventResponse> responsePage = eventPage.map(event -> {
            EventResponse eventResponse = eventMapper.toEventResponse(event);
            eventResponse.setCurrentParticipants(
                    participantCounts.getOrDefault(event.getId(), 0L).intValue());
            eventResponse.setIsRegistered(registeredEventIds.contains(event.getId()));

            User creator = userMap.get(event.getCreateBy());
            if (creator != null) {
                eventResponse.setCreatedById(creator.getId());
                eventResponse.setCreatedByName(creator.getName());
            }

            allManagersOnPage.stream()
                    .filter(manager -> manager.getEventId().equals(event.getId())
                            && manager.getRoleType() == EventManagement.MANAGE)
                    .findFirst().ifPresent(manager -> {
                        User managerUser = userMap.get(manager.getUserId());
                        if (managerUser != null) {
                            eventResponse.setManagerId(managerUser.getId());
                            eventResponse.setManagerName(managerUser.getName());
                        }
                    });

            if (event.getBanner() != null && !event.getBanner().isEmpty()) {
                String bannerUrl = ((FileStorageServiceImpl) fileStorageService).getSignedUrl("banners",
                        event.getBanner());
                eventResponse.setBanner(bannerUrl);
            }

            return eventResponse;
        });

        return new PageResponse<>(responsePage);
    }

    private EventCountersResponse createCountersResponse(Optional<User> userOptional) {
        Map<EventStatus, Long> statusCounts = new EnumMap<>(EventStatus.class);
        eventRepository.countEventsByStatus().forEach(result -> {
            statusCounts.put((EventStatus) result[0], (Long) result[1]);
        });

        EventCountersResponse.EventCountersResponseBuilder builder = EventCountersResponse.builder()
                .upcoming(statusCounts.getOrDefault(EventStatus.UPCOMING, 0L))
                .ongoing(statusCounts.getOrDefault(EventStatus.ONGOING, 0L))
                .completed(statusCounts.getOrDefault(EventStatus.COMPLETED, 0L))
                .cancelled(statusCounts.getOrDefault(EventStatus.CANCELLED, 0L));

        userOptional.ifPresent(user -> {
            long managedCount = eventRepository.countManagedEventsByUserId(user.getId());
            builder.manage(managedCount);
        });

        return builder.build();
    }
}
