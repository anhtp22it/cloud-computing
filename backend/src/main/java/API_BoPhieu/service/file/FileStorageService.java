package API_BoPhieu.service.file;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file, String subDir, String prefix);

    Resource loadFileAsResource(String subDir, String filename);

    void deleteFile(String subDir, String filename);
}
