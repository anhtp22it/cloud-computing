package API_BoPhieu.entity;

import java.time.Instant;
import java.util.Set;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, name = "hash_password")
    private String hashPassword;

    @Column(nullable = false, name = "phone_number", length = 10)
    private String phoneNumber;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean enabled = true;

    @Column(name = "unit_id")
    private Integer unitId;

    @Column(name = "password_reset_token", unique = true, nullable = true)
    private String passwordResetToken;

    @Column(name = "password_reset_token_expiry", nullable = true)
    private Instant passwordResetTokenExpiry;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Set<Role> roles;
}
