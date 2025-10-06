package API_BoPhieu.controller;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import API_BoPhieu.service.file.FileStorageService;
import API_BoPhieu.service.file.FileStorageServiceImpl;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/medias")
@RequiredArgsConstructor
public class MediaController {
    private static final Logger log = LoggerFactory.getLogger(MediaController.class);
    private final FileStorageService fileStorageService;

    @PostMapping("/image-upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        log.info("Nhận yêu cầu upload ảnh: {}, kích thước: {} bytes", file.getOriginalFilename(),
                file.getSize());

        if (file.getSize() > 10 * 1024 * 1024) {
            log.warn("File upload có kích thước quá lớn: {} bytes", file.getSize());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Kích thước file không được quá 10MB"));
        }

        String fileName = fileStorageService.storeFile(file, "images", "img_");
        String publicUrl = ((FileStorageServiceImpl) fileStorageService).getSignedUrl("images", fileName);

        log.info("Upload ảnh thành công. URL: {}", publicUrl);

        return ResponseEntity.ok(Map.of("url", publicUrl));
    }
}
