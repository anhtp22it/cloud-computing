package API_BoPhieu.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendants", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "event_id", "user_id" })
})
public class Attendant {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name = "user_id")
    private Integer userId;

    @Column(nullable = false, name = "event_id")
    private Integer eventId;

    @Column(name = "checked_time")
    private Instant checkedTime;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false)
    private Instant joinedAt;
}
