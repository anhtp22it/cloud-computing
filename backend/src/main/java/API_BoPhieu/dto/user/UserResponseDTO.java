package API_BoPhieu.dto.user;

import java.util.Set;
import API_BoPhieu.dto.unit.UnitResponseDTO;
import API_BoPhieu.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Integer id;
    private String name;
    private String email;
    private String phoneNumber;
    private Boolean enabled;
    private UnitResponseDTO unit;
    private Set<Role> roles;
}
