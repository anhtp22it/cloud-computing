package API_BoPhieu.service.unit;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import API_BoPhieu.constants.UnitType;
import API_BoPhieu.dto.common.PageResponse;
import API_BoPhieu.dto.unit.UnitRequestDTO;
import API_BoPhieu.dto.unit.UnitResponseDTO;
import API_BoPhieu.entity.Unit;
import API_BoPhieu.exception.ConflictException;
import API_BoPhieu.exception.ResourceNotFoundException;
import API_BoPhieu.mapper.UnitMapper;
import API_BoPhieu.repository.UnitRepository;
import API_BoPhieu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final UnitMapper unitMapper;

    private List<UnitResponseDTO> toDtoListWithParentNames(List<Unit> units) {
        if (units.isEmpty()) {
            return Collections.emptyList();
        }
        List<Integer> parentIds = units.stream().map(Unit::getParentId).filter(id -> id != null)
                .distinct().collect(Collectors.toList());

        Map<Integer, String> parentIdToNameMap = unitRepository.findAllById(parentIds).stream()
                .collect(Collectors.toMap(Unit::getId, Unit::getUnitName));

        return units.stream().map(unit -> {
            UnitResponseDTO dto = unitMapper.toResponse(unit);
            if (unit.getParentId() != null) {
                dto.setParentName(parentIdToNameMap.get(unit.getParentId()));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UnitResponseDTO> list(String q, Pageable pageable) {
        log.debug("Bắt đầu lấy danh sách đơn vị với từ khóa: '{}', trang: {}", q,
                pageable.getPageNumber());
        Page<Unit> unitPage = StringUtils.hasText(q)
                ? unitRepository.findByUnitNameContainingIgnoreCase(q, pageable)
                : unitRepository.findAll(pageable);

        List<UnitResponseDTO> dtoList = toDtoListWithParentNames(unitPage.getContent());
        Page<UnitResponseDTO> dtoPage = new PageImpl<>(dtoList, pageable, unitPage.getTotalElements());

        log.info("Lấy thành công {} đơn vị.", unitPage.getNumberOfElements());

        return new PageResponse<>(dtoPage);
    }

    @Override
    @Cacheable(cacheNames = "unit_detail", key = "#id")
    @Transactional(readOnly = true)
    public UnitResponseDTO get(Integer id) {
        log.debug("Bắt đầu lấy thông tin đơn vị ID: {}", id);
        Unit unit = unitRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy đơn vị với ID: " + id));
        log.info("Lấy thành công thông tin đơn vị '{}' (ID: {})", unit.getUnitName(), id);
        return toDtoListWithParentNames(List.of(unit)).get(0);
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = { "units_paginated", "all_units", "unit_detail" }, allEntries = true)
    public UnitResponseDTO create(UnitRequestDTO req) {
        log.debug("Bắt đầu tạo đơn vị mới với tên: '{}'", req.getUnitName());
        if (unitRepository.existsByUnitNameIgnoreCase(req.getUnitName())) {
            throw new ConflictException("Tên đơn vị '" + req.getUnitName() + "' đã tồn tại.");
        }

        Unit newUnit = unitMapper.toEntity(req);

        if (req.getParentId() == null) {
            Unit savedUnit = unitRepository.save(newUnit);
            savedUnit.setParentId(savedUnit.getId());
            unitRepository.save(savedUnit);
            log.info("Đã tạo thành công đơn vị CHA '{}' (ID: {})", savedUnit.getUnitName(), savedUnit.getId());
            return toDtoListWithParentNames(List.of(savedUnit)).get(0);
        } else {
            if (!unitRepository.existsById(req.getParentId())) {
                throw new ResourceNotFoundException(
                        "Đơn vị cha với ID " + req.getParentId() + " không tồn tại.");
            }
            Unit savedUnit = unitRepository.save(newUnit);
            log.info("Đã tạo thành công đơn vị CON '{}' (ID: {})", savedUnit.getUnitName(),
                    savedUnit.getId());
            return toDtoListWithParentNames(List.of(savedUnit)).get(0);
        }
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = { "units_paginated", "all_units", "unit_detail" }, allEntries = true)
    public UnitResponseDTO update(Integer id, UnitRequestDTO req) {
        log.debug("Bắt đầu cập nhật đơn vị ID: {}", id);
        Unit existingUnit = unitRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy đơn vị với ID: " + id));

        unitRepository.findByUnitNameIgnoreCase(req.getUnitName()).ifPresent(unitWithSameName -> {
            if (!unitWithSameName.getId().equals(id)) {
                throw new ConflictException("Tên đơn vị '" + req.getUnitName() + "' đã tồn tại.");
            }
        });

        existingUnit.setUnitName(req.getUnitName());
        existingUnit.setUnitType(req.getUnitType());

        if (req.getParentId() == null) {
            existingUnit.setParentId(id);
        } else {
            if (id.equals(req.getParentId())) {
                throw new ConflictException("Một đơn vị không thể là con của chính nó.");
            }
            if (!unitRepository.existsById(req.getParentId())) {
                throw new ResourceNotFoundException(
                        "Đơn vị cha với ID " + req.getParentId() + " không tồn tại.");
            }
            existingUnit.setParentId(req.getParentId());
        }

        Unit updatedUnit = unitRepository.save(existingUnit);
        log.info("Đã cập nhật thành công đơn vị '{}' (ID: {})", updatedUnit.getUnitName(),
                updatedUnit.getId());
        return toDtoListWithParentNames(List.of(updatedUnit)).get(0);
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = { "units_paginated", "all_units", "unit_detail" }, allEntries = true)
    public void delete(Integer id) {
        log.debug("Bắt đầu xóa đơn vị ID: {}", id);
        Unit unitToDelete = unitRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy đơn vị với ID: " + id));

        boolean isParent = unitToDelete.getId().equals(unitToDelete.getParentId());
        List<Unit> childUnits = Collections.emptyList();

        if (isParent) {
            childUnits = unitRepository.findByParentIdAndIdNot(id, id);
        }

        if (!childUnits.isEmpty()) {
            log.warn("Đơn vị cha ID {} có {} đơn vị con. Bắt đầu xóa hàng loạt.", id,
                    childUnits.size());

            for (Unit child : childUnits) {
                if (userRepository.existsByUnitId(child.getId())) {
                    log.warn(
                            "Không thể xóa hàng loạt: Đơn vị con '{}' (ID: {}) vẫn còn người dùng.",
                            child.getUnitName(), child.getId());
                    throw new ConflictException("Không thể xóa vì đơn vị con '"
                            + child.getUnitName() + "' vẫn còn người dùng.");
                }
            }

            unitRepository.deleteAll(childUnits);
            log.info("Đã xóa thành công {} đơn vị con.", childUnits.size());
        }

        if (userRepository.existsByUnitId(id)) {
            log.warn("Xóa đơn vị ID {} thất bại: Vẫn còn người dùng thuộc về nó.", id);
            throw new ConflictException("Không thể xóa đơn vị vì vẫn còn người dùng thuộc về nó.");
        }

        unitRepository.deleteById(id);
        log.info("Đã xóa thành công đơn vị ID: {}", id);
    }

    @Override
    @Cacheable(cacheNames = "all_units")
    @Transactional(readOnly = true)
    public List<UnitResponseDTO> getUnitsByType(UnitType type) {
        log.debug("Bắt đầu lấy danh sách đơn vị theo loại: {}", type);
        List<Unit> units = unitRepository.findByUnitType(type);
        log.info("Tìm thấy {} đơn vị thuộc loại {}", units.size(), type);
        return toDtoListWithParentNames(units);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitResponseDTO> getChildUnits(Integer parentId) {
        log.debug("Bắt đầu lấy danh sách đơn vị con của đơn vị cha ID: {}", parentId);
        if (!unitRepository.existsById(parentId)) {
            throw new ResourceNotFoundException("Không tìm thấy đơn vị cha với ID: " + parentId);
        }
        List<Unit> units = unitRepository.findByParentId(parentId);
        log.info("Đơn vị cha ID {} có {} đơn vị con.", parentId, units.size());
        return toDtoListWithParentNames(units);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitResponseDTO> getAllUnits() {
        log.debug("Lấy danh sách tất cả các đơn vị.");
        List<Unit> units = unitRepository.findAll();

        return toDtoListWithParentNames(units);
    }
}
