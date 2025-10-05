package API_BoPhieu.dto.user;


import lombok.Data;

@Data
public class UserRequestDTO {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private Boolean enabled;
    private Integer unitId;
}
