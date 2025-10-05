package API_BoPhieu.service.auth;

import API_BoPhieu.dto.auth.ChangePasswordDto;
import API_BoPhieu.dto.auth.LoginDto;
import API_BoPhieu.dto.auth.LoginResponse;
import API_BoPhieu.dto.auth.RegisterDto;
import API_BoPhieu.dto.user.UserResponseDTO;

public interface AuthService {
    LoginResponse login(LoginDto loginDto);

    void register(RegisterDto registerDto);

    UserResponseDTO getAuthUser(String email);

    LoginResponse refreshToken(String refreshToken);

    void logout(String refreshToken);

    void changePassword(String email, ChangePasswordDto changePasswordDto);

    void processForgotPassword(String email);

    void processResetPassword(String token, String newPassword);
}
