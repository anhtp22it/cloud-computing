package API_BoPhieu.service.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import API_BoPhieu.entity.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void sendPasswordResetEmail(User user, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@eventmanagement.com");
        message.setTo(user.getEmail());
        message.setSubject("Yêu cầu đặt lại mật khẩu cho tài khoản Event Management");
        message.setText("Chào " + user.getName() + ",\n\n"
                + "Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n"
                + "Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn:\n" + resetUrl
                + "\n\n" + "Liên kết này sẽ hết hạn sau 15 phút.\n"
                + "Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.\n\n" + "Trân trọng,\n"
                + "Đội ngũ Event Management.");

        mailSender.send(message);
    }

}
