package API_BoPhieu.entity;

import java.time.Instant;

import API_BoPhieu.constants.EventStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name = "title")
    private String title;

    @Column(nullable = false, name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, name = "start_time")
    private Instant startTime;

    @Column(nullable = false, name = "end_time")
    private Instant endTime;

    @Column(nullable = false, name = "location")
    private String location;

    @Column(name = "room_id")
    private Integer roomId;

    @Column(nullable = false, name = "create_by")
    private Integer createBy;

    @Column(nullable = false, name = "status")
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.UPCOMING;

    @Column(name = "banner", nullable = true)
    private String banner;

    @Column(nullable = false, name = "url_docs")
    private String urlDocs;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "qr_join_token", unique = true)
    private String qrJoinToken;

    @CreationTimestamp
    @Column(nullable = false, name = "create_at")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false, name = "update_at")
    private Instant updatedAt;
}
