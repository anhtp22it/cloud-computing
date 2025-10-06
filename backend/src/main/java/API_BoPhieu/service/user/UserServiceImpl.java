package API_BoPhieu.service.user;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import API_BoPhieu.dto.unit.UnitResponseDTO;
import API_BoPhieu.dto.user.UpdateUserUnitRequestDTO;
import API_BoPhieu.dto.user.UserRequestDTO;
import API_BoPhieu.dto.user.UserResponseDTO;
import API_BoPhieu.entity.Role;
import API_BoPhieu.entity.Unit;
import API_BoPhieu.entity.User;
import API_BoPhieu.exception.ResourceNotFoundException;
import API_BoPhieu.mapper.UnitMapper;
import API_BoPhieu.mapper.UserMapper;
import API_BoPhieu.repository.RoleRepository;
import API_BoPhieu.repository.UnitRepository;
import API_BoPhieu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UnitRepository unitRepository;
    private final UnitMapper unitMapper;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    private List<UserResponseDTO> mapUsersToUserResponseDTOs(List<User> users) {
        if (users == null || users.isEmpty()) {
            return Collections.emptyList();
        }

        Set<Integer> directUnitIds = users.stream()
                .map(User::getUnitId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (directUnitIds.isEmpty()) {
            return users.stream().map(userMapper::toResponseDTO).collect(Collectors.toList());
        }

        List<Unit> directUnits = unitRepository.findAllById(directUnitIds);

        Set<Integer> parentUnitIds = directUnits.stream()
                .map(Unit::getParentId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Integer, Unit> fullUnitMap = directUnits.stream()
                .collect(Collectors.toMap(Unit::getId, Function.identity()));

        if (!parentUnitIds.isEmpty()) {
            unitRepository.findAllById(parentUnitIds)
                    .forEach(parentUnit -> fullUnitMap.putIfAbsent(parentUnit.getId(), parentUnit));
        }

        return users.stream().map(user -> {
            UserResponseDTO userDto = userMapper.toResponseDTO(user);
            if (user.getUnitId() != null) {
                Unit unit = fullUnitMap.get(user.getUnitId());
                if (unit != null) {
                    UnitResponseDTO unitDto = unitMapper.toResponse(unit);
                    if (unit.getParentId() != null) {
                        Unit parentUnit = fullUnitMap.get(unit.getParentId());
                        if (parentUnit != null) {
                            unitDto.setParentName(parentUnit.getUnitName());
                        }
                    }
                    userDto.setUnit(unitDto);
                }
            }
            return userDto;
        }).collect(Collectors.toList());
    }

    @Override
    @Cacheable(cacheNames = "users")
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        log.debug("Lấy danh sách tất cả người dùng.");
        List<User> users = userRepository.findAll();
        return mapUsersToUserResponseDTOs(users);
    }

    @Override
    @Cacheable(cacheNames = "users", key = "#id")
    public UserResponseDTO getUserById(Integer id) {
        log.debug("Lấy thông tin người dùng ID: {}", id);
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        return mapUsersToUserResponseDTOs(Collections.singletonList(user)).get(0);
    }

    @Override
    @CacheEvict(cacheNames = "users", allEntries = true)
    @Transactional
    public void disableUser(Integer id) {
        log.debug("Vô hiệu hóa người dùng ID: {}", id);
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        user.setEnabled(false);
        userRepository.save(user);
        log.info("Đã vô hiệu hóa thành công người dùng '{}' (ID: {})", user.getEmail(), id);
    }

    @Override
    @CacheEvict(cacheNames = "users", allEntries = true)
    @Transactional
    public void enableUser(Integer id) {
        log.debug("Kích hoạt người dùng ID: {}", id);
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        user.setEnabled(true);
        userRepository.save(user);
        log.info("Đã kích hoạt thành công người dùng '{}' (ID: {})", user.getEmail(), id);
    }

    @Override
    @CacheEvict(cacheNames = "users", allEntries = true)
    @Transactional
    public UserResponseDTO modifyUser(Integer id, UserRequestDTO userDto, User currentUser) {
        log.debug("Người dùng '{}' yêu cầu cập nhật thông tin cho người dùng ID: {}",
                currentUser.getEmail(), id);

        if (!currentUser.getId().equals(id)) {
            throw new AccessDeniedException(
                    "Bạn không có quyền chỉnh sửa thông tin của người dùng này.");
        }

        User userToUpdate = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        userToUpdate.setName(userDto.getName());
        userToUpdate.setPhoneNumber(userDto.getPhoneNumber());
        userToUpdate.setUnitId(userDto.getUnitId());
        User updatedUser = userRepository.save(userToUpdate);
        log.info("Người dùng '{}' đã cập nhật thành công thông tin.", updatedUser.getEmail());

        return getUserById(updatedUser.getId());
    }

    @Override
    public List<UserResponseDTO> getUsersByUnit(Integer unitId) {
        log.debug("Lấy danh sách người dùng thuộc đơn vị ID: {}", unitId);
        if (!unitRepository.existsById(unitId)) {
            throw new ResourceNotFoundException("Không tìm thấy đơn vị với ID: " + unitId);
        }
        List<User> users = userRepository.findByUnitId(unitId);
        return mapUsersToUserResponseDTOs(users);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        log.debug("Lấy danh sách tất cả các vai trò.");
        return roleRepository.findAll();
    }

    @Override
    @CacheEvict(cacheNames = "users", allEntries = true)
    @Transactional
    public UserResponseDTO updateUserRole(Integer userId, Integer roleId) {
        log.debug("Yêu cầu cập nhật vai trò cho người dùng ID: {}", userId);
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        Role role = roleRepository.findById(roleId).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));

        user.setRoles(new HashSet<>(Collections.singletonList(role)));
        User updatedUser = userRepository.save(user);
        log.info("Đã cập nhật thành công vai trò cho người dùng '{}'", updatedUser.getEmail());

        return getUserById(updatedUser.getId());
    }

    @Override
    @CacheEvict(cacheNames = "users", allEntries = true)
    @Transactional
    public UserResponseDTO updateUserUnitByAdmin(Integer userId, UpdateUserUnitRequestDTO dto) {
        log.debug("Admin yêu cầu cập nhật đơn vị cho người dùng ID: {}", userId);

        User userToUpdate = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        unitRepository.findById(dto.getUnitId()).orElseThrow(() -> new ResourceNotFoundException(
                "Không tìm thấy đơn vị với ID: " + dto.getUnitId()));

        userToUpdate.setUnitId(dto.getUnitId());
        userRepository.save(userToUpdate);
        log.info("Admin đã cập nhật thành công đơn vị cho người dùng '{}'",
                userToUpdate.getEmail());

        return getUserById(userId);
    }
}
