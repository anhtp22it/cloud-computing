package API_BoPhieu.service.attendant;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import API_BoPhieu.constants.EventManagement;
import API_BoPhieu.constants.EventStatus;
import API_BoPhieu.dto.attendant.ParticipantDto;
import API_BoPhieu.dto.attendant.ParticipantResponse;
import API_BoPhieu.dto.attendant.ParticipantsDto;
import API_BoPhieu.dto.unit.UnitResponseDTO;
import API_BoPhieu.dto.user.UserResponseDTO;
import API_BoPhieu.entity.Attendant;
import API_BoPhieu.entity.Event;
import API_BoPhieu.entity.EventManager;
import API_BoPhieu.entity.Unit;
import API_BoPhieu.entity.User;
import API_BoPhieu.exception.AuthException;
import API_BoPhieu.exception.ConflictException;
import API_BoPhieu.exception.NotFoundException;
import API_BoPhieu.repository.AttendantRepository;
import API_BoPhieu.repository.EventManagerRepository;
import API_BoPhieu.repository.EventRepository;
import API_BoPhieu.repository.UnitRepository;
import API_BoPhieu.repository.UserRepository;
import API_BoPhieu.service.sse.SseService;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AttendantServiceImpl implements AttendantService {
    private static final Logger log = LoggerFactory.getLogger(AttendantServiceImpl.class);

    private final AttendantRepository attendantRepository;
    private final SseService sseService;
    private final QRCodeService qrCodeService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventManagerRepository eventManagerRepository;
    private final UnitRepository unitRepository;

    @Value("${api.prefix}")
    private String apiPrefix;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "PARTICIPANTS_BY_EVENT", key = "'event:' + #eventId")
    public List<ParticipantResponse> getParticipantByEventId(Integer eventId) {
        log.debug("Bắt đầu lấy danh sách người tham gia cho sự kiện ID: {}", eventId);
        List<Attendant> attendants = attendantRepository.findByEventId(eventId);
        if (attendants.isEmpty()) {
            return Collections.emptyList();
        }

        Set<Integer> userIds =
                attendants.stream().map(Attendant::getUserId).collect(Collectors.toSet());

        Map<Integer, User> userMap = userRepository.findAllById(new ArrayList<>(userIds)).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        Set<Integer> unitIds = userMap.values().stream().map(User::getUnitId)
                .filter(id -> id != null).collect(Collectors.toSet());

        Map<Integer, Unit> unitMap = Collections.emptyMap();
        if (!unitIds.isEmpty()) {
            unitMap = unitRepository.findAllById(new ArrayList<>(unitIds)).stream()
                    .collect(Collectors.toMap(Unit::getId, unit -> unit));
        }

        final Map<Integer, Unit> finalUnitMap = unitMap;

        return attendants.stream().map(attendant -> {
            User user = userMap.get(attendant.getUserId());
            if (user == null) {
                return null;
            }
            Unit unit = (user.getUnitId() != null) ? finalUnitMap.get(user.getUnitId()) : null;
            return mapToParticipantResponse(attendant, user, unit);
        }).filter(response -> response != null).collect(Collectors.toList());
    }

    @Override
    @Caching(evict = {
            @CacheEvict(cacheNames = "PARTICIPANTS_BY_EVENT", key = "'event:' + #result.eventId",
                    condition = "#result != null"),
            @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true), // vì currentParticipants &
                                                                         // isRegistered thay đổi
            @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
            @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)})
    public Attendant checkIn(String eventToken, String userEmail) {
        log.debug("Bắt đầu check-in cho người dùng '{}' với event token '{}'", userEmail,
                eventToken);
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new NotFoundException("Không tìm thấy người dùng với email: " + userEmail));
        Event event = eventRepository.findByQrJoinToken(eventToken).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sự kiện với mã QR: " + eventToken));
        Attendant attendant =
                attendantRepository.findByUserIdAndEventId(user.getId(), event.getId())
                        .orElseThrow(() -> new NotFoundException(
                                "Người dùng chưa đăng ký tham gia sự kiện này."));

        if (attendant.getCheckedTime() != null) {
            log.warn(
                    "Người dùng '{}' cố gắng check-in lại sự kiện '{}' trong khi đã check-in từ trước.",
                    userEmail, event.getTitle());
            throw new ConflictException("Bạn đã check-in sự kiện này rồi.");
        }
        attendant.setCheckedTime(Instant.now());
        Attendant updatedAttendant = attendantRepository.save(attendant);
        log.info("Người dùng '{}' (ID: {}) đã check-in thành công sự kiện '{}' (ID: {})",
                user.getEmail(), user.getId(), event.getTitle(), event.getId());

        ParticipantResponse response = mapToParticipantResponse(updatedAttendant, user);
        sseService.sendEventToClients(event.getId(), "participant-checked-in", response);
        return updatedAttendant;
    }

    @Override
    @Cacheable(cacheNames = "QR_IMAGE", key = "'checkin:' + #eventId")
    public byte[] generateQrCheck(Integer eventId) throws Exception {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sự kiện ID: " + eventId));
        String checkInUrl = apiPrefix + "/attendants/check-in/" + event.getQrJoinToken();
        log.debug("Tạo QR code cho URL check-in: {}", checkInUrl);
        return qrCodeService.generateQRCode(checkInUrl);
    }

    @Override
    @Caching(
            evict = {@CacheEvict(cacheNames = "PARTICIPANTS_BY_EVENT", key = "'event:' + #eventId"),
                    @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
                    @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
                    @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)})
    public void deleteParticipantByEventIdAndUserId(Integer eventId, Integer userId) {
        log.debug("Bắt đầu xóa người tham gia ID {} khỏi sự kiện ID {}", userId, eventId);
        Attendant attendant =
                attendantRepository.findByUserIdAndEventId(userId, eventId).orElseThrow(
                        () -> new NotFoundException("Người tham gia không tồn tại trong sự kiện."));
        attendantRepository.delete(attendant);
        log.info("Đã xóa thành công người tham gia ID {} khỏi sự kiện ID {}", userId, eventId);
    }

    @Override
    @Caching(
            evict = {@CacheEvict(cacheNames = "PARTICIPANTS_BY_EVENT", key = "'event:' + #eventId"),
                    @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
                    @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
                    @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)})
    public List<ParticipantResponse> addParticipants(Integer eventId,
            ParticipantsDto participantsDto, String adderEmail) {
        log.info("Người dùng '{}' bắt đầu quá trình thêm {} người tham gia vào sự kiện ID {}",
                adderEmail, participantsDto.getEmails().size(), eventId);
        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sự kiện với ID: " + eventId));
        if (event.getStartTime().isBefore(Instant.now())) {
            log.warn("Thêm người tham gia thất bại: Sự kiện ID {} đã bắt đầu hoặc kết thúc.",
                    eventId);
            throw new ConflictException(
                    "Sự kiện đã bắt đầu hoặc kết thúc, không thể thêm người tham gia.");
        }
        if (event.getStatus() == EventStatus.CANCELLED) {
            log.warn("Thêm người tham gia thất bại: Sự kiện ID {} đã bị hủy.", eventId);
            throw new ConflictException("Sự kiện đã bị hủy.");
        }
        List<String> emails = participantsDto.getEmails().stream().map(ParticipantDto::getEmail)
                .collect(Collectors.toList());
        if (emails.isEmpty()) {
            log.debug("Danh sách email thêm vào trống, không thực hiện hành động nào.");
            return Collections.emptyList();
        }
        List<User> usersToAdd = userRepository.findAllByEmailIn(emails);
        if (usersToAdd.size() != emails.size()) {
            log.warn(
                    "Thêm người tham gia thất bại: Một hoặc nhiều email không tồn tại trong hệ thống.");
            throw new NotFoundException("Một hoặc nhiều email không tồn tại trong hệ thống.");
        }
        List<Integer> userIdsToAdd =
                usersToAdd.stream().map(User::getId).collect(Collectors.toList());
        Set<Integer> existingParticipantIds =
                attendantRepository.findAllByEventIdAndUserIdIn(eventId, userIdsToAdd).stream()
                        .map(Attendant::getUserId).collect(Collectors.toSet());
        List<User> newParticipants =
                usersToAdd.stream().filter(user -> !existingParticipantIds.contains(user.getId()))
                        .collect(Collectors.toList());
        if (newParticipants.isEmpty()) {
            log.info(
                    "Tất cả người dùng trong danh sách đã tham gia sự kiện ID {}, không có ai được thêm mới.",
                    eventId);
            return Collections.emptyList();
        }
        int currentParticipantsCount = attendantRepository.countByEventId(eventId);
        if (event.getMaxParticipants() != null
                && currentParticipantsCount + newParticipants.size() > event.getMaxParticipants()) {
            log.warn(
                    "Thêm người tham gia thất bại: Vượt quá số lượng tối đa cho phép của sự kiện ID {}",
                    eventId);
            throw new ConflictException(
                    "Số lượng người tham gia vượt quá giới hạn tối đa của sự kiện!");
        }
        List<Attendant> attendantsToSave = newParticipants.stream().map(user -> {
            Attendant attendant = new Attendant();
            attendant.setEventId(eventId);
            attendant.setUserId(user.getId());
            return attendant;
        }).collect(Collectors.toList());
        List<Attendant> savedAttendants = attendantRepository.saveAll(attendantsToSave);
        log.info("Đã thêm thành công {} người tham gia mới vào sự kiện ID {}",
                savedAttendants.size(), eventId);
        Map<Integer, User> userMap =
                newParticipants.stream().collect(Collectors.toMap(User::getId, user -> user));
        return savedAttendants.stream().map(attendant -> mapToParticipantResponse(attendant,
                userMap.get(attendant.getUserId()))).collect(Collectors.toList());
    }

    @Override
    @Caching(
            evict = {@CacheEvict(cacheNames = "PARTICIPANTS_BY_EVENT", key = "'event:' + #eventId"),
                    @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
                    @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
                    @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)})
    public void deleteParticipantsByEventIdAndUsersId(Integer eventId,
            ParticipantsDto participantsDto, String removerEmail) {
        log.info("Người dùng '{}' bắt đầu quá trình xóa {} người tham gia khỏi sự kiện ID {}",
                removerEmail, participantsDto.getEmails().size(), eventId);

        User deleter = userRepository.findByEmail(removerEmail).orElseThrow(
                () -> new AuthException("Người dùng thực hiện hành động không tồn tại."));

        EventManagement deleterRole =
                eventManagerRepository.findByUserIdAndEventId(deleter.getId(), eventId)
                        .map(EventManager::getRoleType).orElse(null);

        List<String> emailsToDelete = participantsDto.getEmails().stream()
                .map(ParticipantDto::getEmail).collect(Collectors.toList());

        if (emailsToDelete.isEmpty()) {
            log.debug("Danh sách email cần xóa trống, không thực hiện hành động nào.");
            return;
        }
        List<Integer> userIdsToDelete = userRepository.findAllByEmailIn(emailsToDelete).stream()
                .map(User::getId).collect(Collectors.toList());

        Map<Integer, EventManagement> targetRolesMap = eventManagerRepository
                .findAllByEventIdAndUserIdIn(eventId, userIdsToDelete).stream()
                .collect(Collectors.toMap(EventManager::getUserId, EventManager::getRoleType));

        List<Integer> finalUserIdsToDelete = userIdsToDelete.stream().filter(targetUserId -> {
            EventManagement targetRole = targetRolesMap.get(targetUserId);
            if (deleterRole == EventManagement.MANAGE) {
                boolean canDelete = (targetRole == null || targetRole == EventManagement.STAFF);
                if (!canDelete) {
                    log.warn("Người dùng '{}' (MANAGE) không có quyền xóa user ID {} (vai trò: {})",
                            removerEmail, targetUserId, targetRole);
                }
                return canDelete;
            }
            if (deleterRole == EventManagement.STAFF) {
                boolean canDelete = (targetRole == null);
                if (!canDelete) {
                    log.warn("Người dùng '{}' (STAFF) không có quyền xóa user ID {} (vai trò: {})",
                            removerEmail, targetUserId, targetRole);
                }
                return canDelete;
            }
            return true;
        }).collect(Collectors.toList());
        if (!finalUserIdsToDelete.isEmpty()) {
            long deletedCount =
                    attendantRepository.deleteByEventIdAndUserIdIn(eventId, finalUserIdsToDelete);
            log.info("Đã xóa thành công {}/{} người tham gia khỏi sự kiện ID {}. Yêu cầu bởi '{}'.",
                    deletedCount, userIdsToDelete.size(), eventId, removerEmail);
        } else {
            log.warn("Không có người tham gia nào được xóa khỏi sự kiện ID {} do không đủ quyền.",
                    eventId);
        }
    }

    @Override
    @Caching(
            evict = {@CacheEvict(cacheNames = "PARTICIPANTS_BY_EVENT", key = "'event:' + #eventId"),
                    @CacheEvict(cacheNames = "EVENT_DETAIL", allEntries = true),
                    @CacheEvict(cacheNames = "EVENT_LIST", allEntries = true),
                    @CacheEvict(cacheNames = "MANAGED_EVENTS", allEntries = true)})
    public void cancelMyRegistration(Integer eventId, String userEmail) {
        log.debug("Bắt đầu xử lý tự hủy đăng ký cho user '{}' tại sự kiện ID {}", userEmail,
                eventId);

        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new NotFoundException("Không tìm thấy người dùng với email: " + userEmail));

        Event event = eventRepository.findById(eventId).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sự kiện với ID: " + eventId));

        if (getDisplayStatus(event) != EventStatus.UPCOMING) {
            log.warn("Người dùng '{}' cố gắng hủy đăng ký một sự kiện đã/đang diễn ra (ID: {})",
                    userEmail, eventId);
            throw new ConflictException("Chỉ có thể hủy đăng ký cho các sự kiện sắp diễn ra.");
        }

        long deletedCount = attendantRepository.deleteByEventIdAndUserId(eventId, user.getId());

        if (deletedCount == 0) {
            log.warn(
                    "Người dùng '{}' cố gắng hủy đăng ký nhưng không tìm thấy bản ghi tham gia cho sự kiện ID {}",
                    userEmail, eventId);
            throw new NotFoundException("Bạn chưa đăng ký tham gia sự kiện này.");
        }

        log.info("Người dùng '{}' đã tự hủy đăng ký thành công khỏi sự kiện '{}' (ID: {})",
                userEmail, event.getTitle(), eventId);
    }

    private ParticipantResponse mapToParticipantResponse(Attendant attendant, User user) {
        UserResponseDTO userResponse = UserResponseDTO.builder().id(user.getId())
                .email(user.getEmail()).name(user.getName()).phoneNumber(user.getPhoneNumber())
                .enabled(user.getEnabled()).roles(user.getRoles()).build();

        return ParticipantResponse.builder().id(attendant.getId()).eventId(attendant.getEventId())
                .joinedAt(attendant.getJoinedAt()).checkInTime(attendant.getCheckedTime())
                .user(userResponse).build();
    }

    private ParticipantResponse mapToParticipantResponse(Attendant attendant, User user,
            Unit unit) {
        UnitResponseDTO unitResponse = null;
        if (unit != null) {
            unitResponse = UnitResponseDTO.builder().id(unit.getId()).unitName(unit.getUnitName())
                    .unitType(unit.getUnitType()).parentId(unit.getParentId()).build();
        }

        UserResponseDTO userResponse = UserResponseDTO.builder().id(user.getId())
                .email(user.getEmail()).name(user.getName()).phoneNumber(user.getPhoneNumber())
                .enabled(user.getEnabled()).roles(user.getRoles()).unit(unitResponse).build();

        return ParticipantResponse.builder().id(attendant.getId()).eventId(attendant.getEventId())
                .joinedAt(attendant.getJoinedAt()).checkInTime(attendant.getCheckedTime())
                .user(userResponse).build();
    }

    private EventStatus getDisplayStatus(Event event) {
        Instant now = Instant.now();
        if (event.getStatus() == EventStatus.CANCELLED)
            return EventStatus.CANCELLED;
        if (event.getStatus() == EventStatus.COMPLETED)
            return EventStatus.COMPLETED;
        if (now.isBefore(event.getStartTime()))
            return EventStatus.UPCOMING;
        if (now.isAfter(event.getEndTime()))
            return EventStatus.COMPLETED;
        return EventStatus.ONGOING;
    }
}
