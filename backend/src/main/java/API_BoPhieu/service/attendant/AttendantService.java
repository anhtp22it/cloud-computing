package API_BoPhieu.service.attendant;

import java.util.List;
import API_BoPhieu.dto.attendant.ParticipantResponse;
import API_BoPhieu.dto.attendant.ParticipantsDto;
import API_BoPhieu.entity.Attendant;

public interface AttendantService {

    List<ParticipantResponse> getParticipantByEventId(Integer eventId);

    Attendant checkIn(String eventToken, String userEmail);

    byte[] generateQrCheck(Integer eventId) throws Exception;

    void deleteParticipantByEventIdAndUserId(Integer eventId, Integer userId);

    List<ParticipantResponse> addParticipants(Integer eventId, ParticipantsDto participantsDto,
            String adderEmail);

    void deleteParticipantsByEventIdAndUsersId(Integer eventId, ParticipantsDto participantsDto,
            String removerEmail);

    void cancelMyRegistration(Integer eventId, String userEmail);
}
