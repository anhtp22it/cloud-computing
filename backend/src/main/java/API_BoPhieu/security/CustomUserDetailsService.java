package API_BoPhieu.security;

import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import API_BoPhieu.entity.User;
import API_BoPhieu.repository.UserRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "Không tìm thấy người dùng"));

                Set<GrantedAuthority> authorities = user.getRoles().stream()
                                .map((role) -> new SimpleGrantedAuthority(role.getRoleName()))
                                .collect(Collectors.toSet());

                return new org.springframework.security.core.userdetails.User(
                                email,
                                user.getHashPassword(),
                                authorities);
        }
}
