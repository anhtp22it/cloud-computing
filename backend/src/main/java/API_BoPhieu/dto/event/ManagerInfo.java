package API_BoPhieu.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerInfo {
    private Integer userId;
    private String userName;
    private String userEmail;
}
