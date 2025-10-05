package API_BoPhieu.seed;

import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import API_BoPhieu.entity.Role;
import API_BoPhieu.entity.User;
import API_BoPhieu.exception.AuthException;
import API_BoPhieu.repository.RoleRepository;
import API_BoPhieu.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role roleAdmin = new Role();
            roleAdmin.setRoleName("ROLE_ADMIN");
            Role roleUser = new Role();
            roleUser.setRoleName("ROLE_USER");

            roleRepository.save(roleAdmin);
            roleRepository.save(roleUser);
        }

        if (userRepository.count() == 0) {
            Role roleAdmin = roleRepository.findByRoleName("ROLE_ADMIN")
                    .orElseThrow(() -> {
                        log.error("Không tìm thấy vai trò ADMIN");
                        return new AuthException("Không tìm thấy vai trò ADMIN");
                    });
            User adminUser = new User();
            adminUser.setEmail("admin@yourapp.com");
            adminUser.setName("Super Admin");
            adminUser.setHashPassword(passwordEncoder.encode("123456"));
            adminUser.setPhoneNumber("0773605741");

            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(roleAdmin);
            adminUser.setRoles(adminRoles);

            userRepository.save(adminUser);

            log.info("Đã tạo tài khoản Super Admin");
        }
    }

}
