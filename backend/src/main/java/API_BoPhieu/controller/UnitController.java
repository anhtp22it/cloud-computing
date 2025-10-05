package API_BoPhieu.controller;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import API_BoPhieu.dto.common.PageResponse;
import API_BoPhieu.dto.unit.UnitRequestDTO;
import API_BoPhieu.dto.unit.UnitResponseDTO;
import API_BoPhieu.service.unit.UnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("${api.prefix}/units")
@RequiredArgsConstructor
@Slf4j
public class UnitController {
    private final UnitService unitService;

    @GetMapping
    public ResponseEntity<PageResponse<UnitResponseDTO>> listUnits(
            @RequestParam(name = "q", required = false) String q, Pageable pageable) {
        log.info("Request: Lấy danh sách đơn vị với từ khóa tìm kiếm: {}", q);
        return ResponseEntity.ok(unitService.list(q, pageable));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UnitResponseDTO>> getAllUnits() {
        log.info("ADMIN request: Lấy danh sách tất cả các đơn vị.");
        return ResponseEntity.ok(unitService.getAllUnits());
    }

    @GetMapping("/{id:[\\d]+}")
    public ResponseEntity<UnitResponseDTO> getUnit(@PathVariable Integer id) {
        log.info("Request: Lấy thông tin đơn vị với ID: {}", id);
        return ResponseEntity.ok(unitService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UnitResponseDTO> createUnit(@Valid @RequestBody UnitRequestDTO dto) {
        log.info("ADMIN request: Tạo đơn vị mới với thông tin: {}", dto);
        return new ResponseEntity<>(unitService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UnitResponseDTO> updateUnit(@PathVariable Integer id,
            @Valid @RequestBody UnitRequestDTO dto) {
        log.info("ADMIN request: Cập nhật đơn vị ID: {} với thông tin: {}", id, dto);
        return ResponseEntity.ok(unitService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUnit(@PathVariable Integer id) {
        log.info("ADMIN request: Xóa đơn vị ID: {}", id);
        unitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
