package API_BoPhieu.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file, String subDir, String prefix);

    String getSignedUrl(String subDir, String filename);

    void deleteFile(String subDir, String filename);
}
