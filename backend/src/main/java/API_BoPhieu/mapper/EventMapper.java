package API_BoPhieu.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import API_BoPhieu.dto.event.EventDetailResponse;
import API_BoPhieu.dto.event.EventDto;
import API_BoPhieu.dto.event.EventResponse;
import API_BoPhieu.dto.event.ManagerInfo;
import API_BoPhieu.dto.event.ParticipantInfo;
import API_BoPhieu.dto.event.SecretaryInfo;
import API_BoPhieu.entity.Event;

@Component
public class EventMapper {

    public Event toEntity(EventDto eventDto) {
        if (eventDto == null) {
            return null;
        }

        Event event = new Event();
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setStartTime(eventDto.getStartTime());
        event.setEndTime(eventDto.getEndTime());
        event.setUrlDocs(eventDto.getUrlDocs());
        event.setLocation(eventDto.getLocation());
        event.setMaxParticipants(eventDto.getMaxParticipants());
        return event;
    }

    public EventResponse toEventResponse(Event event) {
        if (event == null) {
            return null;
        }

        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setStatus(event.getStatus());
        response.setUrlDocs(event.getUrlDocs());
        response.setLocation(event.getLocation());
        response.setBanner(event.getBanner());
        response.setCreatedBy(event.getCreateBy());
        response.setMaxParticipants(event.getMaxParticipants());
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        response.setQrJoinToken(event.getQrJoinToken());
        response.setCreatedAt(event.getCreatedAt());

        return response;
    }

    public EventDetailResponse toEventDetailResponse(
            Event event,
            boolean isUserRegistered,
            List<ParticipantInfo> participants,
            List<ManagerInfo> managerInfos,
            List<SecretaryInfo> secretaryInfos) {
        if (event == null) {
            return null;
        }

        return EventDetailResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .location(event.getLocation())
                .createBy(event.getCreateBy())
                .status(event.getStatus())
                .banner(event.getBanner())
                .urlDocs(event.getUrlDocs())
                .maxParticipants(event.getMaxParticipants())
                .qrJoinToken(event.getQrJoinToken())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .isUserRegistered(isUserRegistered)
                .participants(participants)
                .manager(managerInfos)
                .secretaries(secretaryInfos)
                .build();
    }
}
