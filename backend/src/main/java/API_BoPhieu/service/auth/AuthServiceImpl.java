package API_BoPhieu.service.auth;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import API_BoPhieu.dto.auth.ChangePasswordDto;
import API_BoPhieu.dto.auth.LoginDto;
import API_BoPhieu.dto.auth.LoginResponse;
import API_BoPhieu.dto.auth.RegisterDto;
import API_BoPhieu.dto.user.UserResponseDTO;
import API_BoPhieu.entity.RefreshToken;
import API_BoPhieu.entity.Role;
import API_BoPhieu.entity.User;
import API_BoPhieu.exception.AuthException;
import API_BoPhieu.exception.ResourceNotFoundException;
import API_BoPhieu.mapper.UserMapper;
import API_BoPhieu.repository.RefreshTokenRepository;
import API_BoPhieu.repository.RoleRepository;
import API_BoPhieu.repository.UnitRepository;
import API_BoPhieu.repository.UserRepository;
import API_BoPhieu.security.JwtTokenProvider;
import API_BoPhieu.service.email.EmailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {


    @Value("${app.jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs;

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UnitRepository unitRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;
    private final EmailService emailService;

    @Transactional
    @Override
    public LoginResponse login(LoginDto loginDto) {
        log.debug("Bắt đầu xác thực cho người dùng: '{}'", loginDto.getEmail());
        try {
            Authentication authentication =
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                            loginDto.getEmail(), loginDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessTokenStr = jwtTokenProvider.generateToken(authentication);
            String refreshTokenStr = jwtTokenProvider.generateRefreshToken(authentication);

            User user = userRepository.findByEmail(loginDto.getEmail())
                    .orElseThrow(() -> new AuthException("Không tìm thấy người dùng"));

            if (user.getEnabled() == false) {
                log.warn("Người dùng '{}' (ID: {}) đã bị vô hiệu hóa.", user.getEmail(),
                        user.getId());
                throw new AuthException("Tài khoản của bạn đã bị vô hiệu hóa.");
            }

            log.info("Người dùng '{}' (ID: {}) đã đăng nhập thành công.", user.getEmail(),
                    user.getId());

            Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user);
            RefreshToken refreshToken;
            if (existingToken.isPresent()) {
                refreshToken = existingToken.get();
                refreshToken.setToken(refreshTokenStr);
                refreshToken.setExpiryDate(
                        Instant.now().plus(Duration.ofMillis(refreshTokenDurationMs)));
                refreshToken.setRevoked(false);
            } else {
                refreshToken = new RefreshToken();
                refreshToken.setToken(refreshTokenStr);
                refreshToken.setUser(user);
                refreshToken.setExpiryDate(
                        Instant.now().plus(Duration.ofMillis(refreshTokenDurationMs)));
                refreshToken.setRevoked(false);
            }
            refreshTokenRepository.save(refreshToken);

            return new LoginResponse(accessTokenStr, refreshTokenStr, "Bearer");
        } catch (Exception e) {
            log.warn("Đăng nhập thất bại cho người dùng '{}': Sai thông tin đăng nhập.",
                    loginDto.getEmail());
            throw new AuthException("Xác thực thất bại");
        }
    }

    @Override
    public void register(RegisterDto registerDto) {
        log.debug("Bắt đầu quá trình đăng ký cho email: '{}'", registerDto.getEmail());

        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            log.warn("Mật khẩu xác nhận không khớp cho email: '{}'", registerDto.getEmail());
            throw new AuthException("Mật khẩu xác nhận không khớp!");
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            log.warn("Cố gắng đăng ký tài khoản đã tồn tại: '{}'", registerDto.getEmail());
            throw new AuthException("Email đã được đăng ký!");
        }

        Integer unitId = registerDto.getUnitId();
        if (!unitRepository.existsById(unitId)) {
            log.warn("Cố gắng đăng ký với Unit ID không tồn tại: {}", unitId);
            throw new ResourceNotFoundException("Đơn vị với ID " + unitId + " không tồn tại.");
        }

        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setHashPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setPhoneNumber(registerDto.getPhoneNumber());
        user.setUnitId(unitId);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByRoleName("ROLE_USER")
                .orElseThrow(() -> new AuthException("Role USER không tồn tại"));
        roles.add(userRole);
        user.setRoles(roles);
        userRepository.save(user);

        log.info("Tài khoản mới đã được đăng ký thành công cho email: '{}'",
                registerDto.getEmail());
    }

    @Override
    public UserResponseDTO getAuthUser(String email) {
        log.debug("Bắt đầu tìm thông tin người dùng với email: '{}'", email);
        return userRepository.findByEmail(email).map(userMapper::toResponseDTO).orElseThrow(() -> {
            log.warn("Không thể tìm thấy người dùng đã xác thực với email: '{}'", email);
            return new AuthException("Người dùng không tồn tại.");
        });
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        log.debug("Nhận yêu cầu làm mới token.");
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("[RT] validateToken=false (signature/format/expired)");
            throw new AuthException("Refresh token không hợp lệ");
        }

        RefreshToken storedToken =
                refreshTokenRepository.findByToken(refreshToken).orElseThrow(() -> {
                    log.warn("Không tìm thấy refresh token trong cơ sở dữ liệu.");
                    return new AuthException("Refresh token không hợp lệ");
                });

        if (storedToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(storedToken);
            log.warn("Refresh token đã hết hạn cho người dùng '{}' (ID: {})",
                    storedToken.getUser().getEmail(), storedToken.getUser().getId());
            throw new AuthException("Refresh token đã hết hạn");
        }

        User user = storedToken.getUser();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user.getEmail(), null,
                        user.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                                .collect(Collectors.toSet()));

        String newAccessToken = jwtTokenProvider.generateToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        log.info("Đã làm mới token thành công cho người dùng '{}' (ID: {})", user.getEmail(),
                user.getId());

        storedToken.setToken(newRefreshToken);
        storedToken.setExpiryDate(Instant.now().plus(Duration.ofMillis(refreshTokenDurationMs)));
        refreshTokenRepository.save(storedToken);

        return new LoginResponse(newAccessToken, newRefreshToken, "Bearer");
    }

    @Override
    public void logout(String refreshToken) {
        log.debug("Nhận yêu cầu đăng xuất.");
        refreshTokenRepository.findByToken(refreshToken).ifPresent(refreshTokenRepository::delete);
        log.info("Thực hiện đăng xuất thành công.");
    }

    @Override
    public void changePassword(String email, ChangePasswordDto changePasswordDto) {
        log.debug("Bắt đầu quá trình đổi mật khẩu cho người dùng '{}'", email);
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            log.warn("Yêu cầu đổi mật khẩu thất bại, không tìm thấy người dùng: '{}'", email);
            return new AuthException("Không tìm thấy người dùng");
        });

        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getHashPassword())) {
            log.warn("Thay đổi mật khẩu thất bại cho người dùng '{}': Mật khẩu cũ không đúng.",
                    email);
            throw new AuthException("Mật khẩu cũ không chính xác");
        }

        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmNewPassword())) {
            log.warn(
                    "Thay đổi mật khẩu thất bại cho người dùng '{}': Mật khẩu mới và xác nhận không khớp.",
                    email);
            throw new AuthException("Mật khẩu mới và xác nhận không khớp");
        }

        if (passwordEncoder.matches(changePasswordDto.getNewPassword(), user.getHashPassword())) {
            log.warn(
                    "Thay đổi mật khẩu thất bại cho người dùng '{}': Mật khẩu mới không được trùng với mật khẩu cũ.",
                    email);
            throw new AuthException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        user.setHashPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);

        log.info("Người dùng '{}' đã thay đổi mật khẩu thành công.", email);
    }

    @Override
    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(Instant.now().plus(15, ChronoUnit.MINUTES));
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user, token);

            log.info("Đã tạo token reset mật khẩu cho user: {}", email);
        }
    }

    @Override
    public void processResetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new AuthException("Token không hợp lệ hoặc đã hết hạn."));

        if (user.getPasswordResetTokenExpiry().isBefore(Instant.now())) {
            throw new AuthException("Token đã hết hạn.");
        }

        user.setHashPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
        log.info("Đã reset mật khẩu thành công cho user: {}", user.getEmail());
    }
}
