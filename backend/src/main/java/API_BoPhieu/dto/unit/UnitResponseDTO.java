package API_BoPhieu.dto.unit;

import API_BoPhieu.constants.UnitType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitResponseDTO {
    private Integer id;
    private String unitName;
    private UnitType unitType;
    private Integer parentId;
    private String parentName;
}
