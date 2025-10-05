package API_BoPhieu.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import API_BoPhieu.constants.UnitType;
import API_BoPhieu.entity.Unit;

public interface UnitRepository extends JpaRepository<Unit, Integer> {

    boolean existsByUnitNameIgnoreCase(String unitName);

    Page<Unit> findByUnitNameContainingIgnoreCase(String keyword, Pageable pageable);

    List<Unit> findByUnitType(UnitType unitType);

    List<Unit> findByParentId(Integer parentId);

    Optional<Unit> findByUnitNameIgnoreCase(String unitName);

    List<Unit> findByParentIdAndIdNot(Integer parentId, Integer excludeId);
}
