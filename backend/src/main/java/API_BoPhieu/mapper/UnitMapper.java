package API_BoPhieu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import API_BoPhieu.dto.unit.UnitRequestDTO;
import API_BoPhieu.dto.unit.UnitResponseDTO;
import API_BoPhieu.entity.Unit;

@Mapper(componentModel = "spring")
public interface UnitMapper {
    @Mapping(target = "parentName", ignore = true)
    UnitResponseDTO toResponse(Unit entity);

    @Mapping(target = "id", ignore = true)
    Unit toEntity(UnitRequestDTO req);
}
