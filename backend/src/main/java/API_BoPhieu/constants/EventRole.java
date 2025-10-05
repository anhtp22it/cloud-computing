package API_BoPhieu.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum EventRole {
    STAFF(1),
    MANAGE(2);

    @Getter
    private final int level;

    public boolean atLeast(EventRole required) {
        return this.level >= required.level;
    }

    public static EventRole from(String dbValue) {
        return EventRole.valueOf(dbValue.trim().toUpperCase());
    }
}
