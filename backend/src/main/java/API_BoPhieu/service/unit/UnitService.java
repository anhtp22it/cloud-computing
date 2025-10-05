package API_BoPhieu.service.unit;

import java.util.List;
import org.springframework.data.domain.Pageable;
import API_BoPhieu.constants.UnitType;
import API_BoPhieu.dto.common.PageResponse;
import API_BoPhieu.dto.unit.UnitRequestDTO;
import API_BoPhieu.dto.unit.UnitResponseDTO;

public interface UnitService {
    PageResponse<UnitResponseDTO> list(String q, Pageable pageable);

    UnitResponseDTO get(Integer id);

    UnitResponseDTO create(UnitRequestDTO req);

    UnitResponseDTO update(Integer id, UnitRequestDTO req);

    void delete(Integer id);

    List<UnitResponseDTO> getUnitsByType(UnitType type);

    List<UnitResponseDTO> getChildUnits(Integer parentId);

    List<UnitResponseDTO> getAllUnits();
}
