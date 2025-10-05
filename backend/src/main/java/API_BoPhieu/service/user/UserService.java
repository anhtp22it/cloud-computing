package API_BoPhieu.service.user;

import java.util.List;
import API_BoPhieu.dto.user.UpdateUserUnitRequestDTO;
import API_BoPhieu.dto.user.UserRequestDTO;
import API_BoPhieu.dto.user.UserResponseDTO;
import API_BoPhieu.entity.Role;
import API_BoPhieu.entity.User;

public interface UserService {
    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Integer id);

    void disableUser(Integer id);

    void enableUser(Integer id);

    UserResponseDTO modifyUser(Integer id, UserRequestDTO userDto, User currentUser);

    List<UserResponseDTO> getUsersByUnit(Integer unitId);

    List<Role> getAllRoles();

    UserResponseDTO updateUserRole(Integer userId, Integer roleId);

    UserResponseDTO updateUserUnitByAdmin(Integer userId, UpdateUserUnitRequestDTO dto);
}
