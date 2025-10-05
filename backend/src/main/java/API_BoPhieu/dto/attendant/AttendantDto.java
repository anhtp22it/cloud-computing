package API_BoPhieu.dto.attendant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendantDto {
    private Integer userId;
    private Integer eventId;
    private String userName;
    private String userEmail;
}
