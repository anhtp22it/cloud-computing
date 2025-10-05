package API_BoPhieu.service.event;

import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import API_BoPhieu.constants.EventStatus;
import API_BoPhieu.dto.common.PageResponse;
import API_BoPhieu.dto.event.EventDetailResponse;
import API_BoPhieu.dto.event.EventDto;
import API_BoPhieu.dto.event.EventPageWithCountersResponse;
import API_BoPhieu.dto.event.EventResponse;
import API_BoPhieu.entity.Attendant;

import java.util.List;

public interface EventService {
        EventResponse createEvent(EventDto eventDto, String creatorEmail);

        EventResponse updateEvent(Integer eventId, EventDto eventDto);

        EventResponse uploadBanner(Integer eventId, MultipartFile file);

        byte[] generateEventQRCode(Integer eventId, String baseUrl, String creatorEmail) throws Exception;

        Attendant joinEvent(String eventToken, String creatorEmail);

        EventDetailResponse getEventById(Integer eventId, String email);

        EventPageWithCountersResponse getAllEvents(int page, int size, String sortBy, String sortDir,
                        EventStatus status, String search, String email);

        EventPageWithCountersResponse getManagedEvents(int page, int size, String sortBy, String sortDir,
                        EventStatus status, String search, String email);

        void cancelEvent(Integer id);
}
