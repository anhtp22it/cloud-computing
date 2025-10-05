package API_BoPhieu.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDto {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private String phoneNumber;
    private Integer unitId;
}
