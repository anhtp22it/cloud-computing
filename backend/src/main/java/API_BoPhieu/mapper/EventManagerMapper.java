package API_BoPhieu.mapper;

import org.springframework.stereotype.Component;

import API_BoPhieu.dto.event_managers.EventManagerDto;
import API_BoPhieu.dto.event_managers.EventManagerResponse;
import API_BoPhieu.entity.EventManager;

@Component
public class EventManagerMapper {
    public EventManager toEntity(EventManagerDto dto) {
        if (dto == null) {
            return null;
        }
        EventManager entity = new EventManager();
        entity.setEventId(dto.getEventId());
        entity.setUserId(dto.getUserId());
        entity.setRoleType(dto.getRoleType());

        return entity;
    }

    public EventManagerResponse toResponse(EventManager entity) {
        if (entity == null) {
            return null;
        }
        EventManagerResponse response = new EventManagerResponse();
        response.setEventId(entity.getEventId());
        response.setUserId(entity.getUserId());
        response.setRoleType(entity.getRoleType());
        response.setAssignedby(entity.getAssignedby());

        return response;
    }

    public EventManagerDto toDto(EventManager entity) {
        if (entity == null) {
            return null;
        }
        EventManagerDto dto = new EventManagerDto();
        dto.setEventId(entity.getEventId());
        dto.setUserId(entity.getUserId());
        dto.setRoleType(entity.getRoleType());

        return dto;
    }
}
