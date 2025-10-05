package API_BoPhieu.specification;

import org.springframework.data.jpa.domain.Specification;

import API_BoPhieu.constants.EventStatus;
import API_BoPhieu.entity.Event;
import API_BoPhieu.entity.EventManager;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class EventSpecification {

    public static Specification<Event> isNotCancelled() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.notEqual(root.get("status"), EventStatus.CANCELLED);
    }

    public static Specification<Event> hasStatus(EventStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    public static Specification<Event> hasTitleContaining(String title) {
        return (root, query, criteriaBuilder) -> {
            if (title == null || title.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<Event> isManagedByUser(Integer userId) {
        return (root, query, criteriaBuilder) -> {
            Subquery<Integer> subquery = query.subquery(Integer.class);
            Root<EventManager> eventManagerRoot = subquery.from(EventManager.class);

            subquery.select(eventManagerRoot.get("eventId"))
                    .where(criteriaBuilder.equal(eventManagerRoot.get("userId"), userId));

            return root.get("id").in(subquery);
        };
    }

    public static Specification<Event> isManagedByUserExists(Integer userId) {
        return (root, query, criteriaBuilder) -> {
            Subquery<Integer> subquery = query.subquery(Integer.class);
            Root<EventManager> eventManagerRoot = subquery.from(EventManager.class);

            subquery.select(criteriaBuilder.literal(1))
                    .where(
                            criteriaBuilder.and(
                                    criteriaBuilder.equal(eventManagerRoot.get("eventId"), root.get("id")),
                                    criteriaBuilder.equal(eventManagerRoot.get("userId"), userId)));

            return criteriaBuilder.exists(subquery);
        };
    }

    public static Specification<Event> searchByKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            String pattern = "%" + keyword.toLowerCase().trim() + "%";

            Predicate predicateForTitle = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern);
            Predicate predicateForLocation = criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), pattern);
            Predicate predicateForDescription = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")),
                    pattern);

            return criteriaBuilder.or(predicateForTitle, predicateForLocation, predicateForDescription);
        };
    }
}
