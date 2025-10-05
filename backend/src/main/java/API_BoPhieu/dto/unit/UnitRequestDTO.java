package API_BoPhieu.dto.unit;

import API_BoPhieu.constants.UnitType;
import lombok.Data;

@Data
public class UnitRequestDTO {
    private String unitName;
    private UnitType unitType;
    private Integer parentId;
}
