package API_BoPhieu.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import API_BoPhieu.dto.user.UpdateUserUnitRequestDTO;
import API_BoPhieu.dto.user.UserRequestDTO;
import API_BoPhieu.dto.user.UserResponseDTO;
import API_BoPhieu.entity.Role;
import API_BoPhieu.entity.User;
import API_BoPhieu.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        log.info("ADMIN request: Lấy danh sách tất cả người dùng.");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id:[\\\\d]+}")
    @PreAuthorize("hasRole('ADMIN') or #id == @authenticationPrincipal.id")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Integer id) {
        log.info("Request: Lấy thông tin người dùng ID: {}", id);
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> disableUser(@PathVariable Integer id) {
        log.info("ADMIN request: Vô hiệu hóa người dùng ID: {}", id);
        userService.disableUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> enableUser(@PathVariable Integer id) {
        log.info("ADMIN request: Kích hoạt người dùng ID: {}", id);
        userService.enableUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDTO> modifyUser(@PathVariable Integer id,
            @RequestBody UserRequestDTO userDto, @AuthenticationPrincipal User currentUser) {
        UserResponseDTO updatedUser = userService.modifyUser(id, userDto, currentUser);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/admin/{id}/unit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUserUnitByAdmin(@PathVariable Integer id,
            @RequestBody UpdateUserUnitRequestDTO dto) {
        UserResponseDTO updatedUser = userService.updateUserUnitByAdmin(id, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/by-unit/{unitId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getUsersByUnit(@PathVariable Integer unitId) {
        log.info("ADMIN request: Lấy người dùng theo đơn vị ID: {}", unitId);
        return ResponseEntity.ok(userService.getUsersByUnit(unitId));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Role>> getAllRoles() {
        log.info("ADMIN request: Lấy danh sách tất cả các vai trò.");
        return ResponseEntity.ok(userService.getAllRoles());
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUserRoles(@PathVariable Integer id,
            @RequestBody Map<String, Integer> requestBody) {
        Integer roleId = requestBody.get("role_id");
        if (roleId == null) {
            throw new IllegalArgumentException("role_id là bắt buộc.");
        }
        log.info("ADMIN request: Cập nhật vai trò cho người dùng ID: {}", id);
        UserResponseDTO updatedUser = userService.updateUserRole(id, roleId);
        return ResponseEntity.ok(updatedUser);
    }
}
