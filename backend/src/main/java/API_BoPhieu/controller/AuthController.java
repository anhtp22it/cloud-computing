package API_BoPhieu.controller;

import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import API_BoPhieu.dto.auth.ChangePasswordDto;
import API_BoPhieu.dto.auth.LoginDto;
import API_BoPhieu.dto.auth.LoginResponse;
import API_BoPhieu.dto.auth.RegisterDto;
import API_BoPhieu.dto.auth.ResetPasswordDto;
import API_BoPhieu.dto.user.UserResponseDTO;
import API_BoPhieu.exception.AuthException;
import API_BoPhieu.service.auth.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Value("${app.jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    private final AuthService authService;

    private ResponseCookie createRefreshTokenCookie(String token, long maxAgeMs) {
        return ResponseCookie.from("refreshToken", token).httpOnly(true).secure(cookieSecure)
                .path("/").maxAge(Duration.ofMillis(maxAgeMs)).sameSite("Strict").build();
    }

    private Optional<String> getRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName())).map(Cookie::getValue)
                .findFirst();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginDto loginDto,
            HttpServletResponse response) {
        log.info("Nhận được yêu cầu đăng nhập cho người dùng: '{}'", loginDto.getEmail());
        LoginResponse loginResponse = authService.login(loginDto);

        ResponseCookie refreshTokenCookie =
                createRefreshTokenCookie(loginResponse.getRefreshToken(), refreshTokenDurationMs);
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());

        loginResponse.setRefreshToken(null);

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = getRefreshTokenFromCookies(request)
                .orElseThrow(() -> new AuthException("Không có refresh token"));

        log.info("[RT] cookie len={}, head={}..{}", refreshToken.length(),
                refreshToken.substring(0, Math.min(12, refreshToken.length())),
                refreshToken.substring(Math.max(0, refreshToken.length() - 12)));

        LoginResponse loginResponse = authService.refreshToken(refreshToken);

        ResponseCookie newRefreshTokenCookie =
                createRefreshTokenCookie(loginResponse.getRefreshToken(), refreshTokenDurationMs);
        response.addHeader("Set-Cookie", newRefreshTokenCookie.toString());

        loginResponse.setRefreshToken(null);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        getRefreshTokenFromCookies(request).ifPresent(authService::logout);

        ResponseCookie deleteCookie = createRefreshTokenCookie("", 0);
        response.addHeader("Set-Cookie", deleteCookie.toString());

        return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        log.info("Nhận được yêu cầu đăng ký cho email: '{}'", registerDto.getEmail());
        authService.register(registerDto);
        return ResponseEntity.ok(Map.of("message", "Đăng ký tài khoản thành công!"));
    }

    @GetMapping("/auth-user")
    public ResponseEntity<?> getUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new AuthException("Người dùng chưa xác thực");
        }
        log.debug("Nhận yêu cầu lấy thông tin người dùng đã xác thực: '{}'",
                authentication.getName());
        UserResponseDTO response = authService.getAuthUser(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication authentication,
            @RequestBody ChangePasswordDto changePasswordDto) {
        System.out.println(changePasswordDto);
        log.info("Nhận yêu cầu đổi mật khẩu cho người dùng: '{}'", authentication.getName());
        authService.changePassword(authentication.getName(), changePasswordDto);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.processForgotPassword(email);
        return ResponseEntity.ok(Map.of("message",
                "Nếu email của bạn tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        authService.processResetPassword(resetPasswordDto.getToken(),
                resetPasswordDto.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Đặt lại mật khẩu thành công."));
    }
}
