package API_BoPhieu.entity;

import API_BoPhieu.constants.EventManagement;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "event_managers")
public class EventManager {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name = "user_id")
    private Integer userId;

    @Column(nullable = false, name = "event_id")
    private Integer eventId;

    @Enumerated(EnumType.STRING)

    @Column(nullable = false, name = "type")
    private EventManagement roleType;

    @Column(nullable = false, name = "assigned_by")
    private Integer assignedby;

}
