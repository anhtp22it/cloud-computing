package API_BoPhieu.service.file;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import API_BoPhieu.exception.FileException;
import jakarta.annotation.PostConstruct;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        createUploadDirectory();
    }

    private void createUploadDirectory() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new FileException("Không thể tạo thư mục tải lên: ");
        }
    }

    private void createDirectoryIfNotExists(Path path) {
        try {
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            throw new FileException("Không thể tạo thư mục: " + path.toString());
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDir, String prefix) {
        try {
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String newFilename = prefix + "_" + System.currentTimeMillis() + fileExtension;

            Path subDirPath = Paths.get(uploadDir, subDir);
            createDirectoryIfNotExists(subDirPath);
            Path targetLocation = subDirPath.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFilename;
        } catch (IOException e) {
            throw new FileException("Không thể lưu trữ tệp. Vui lòng thử lại!");
        }
    }

    @Override
    public Resource loadFileAsResource(String subDir, String filename) {
        try {
            Path filePath = Paths.get(uploadDir, subDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new FileException("Không tìm thấy tệp: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new FileException("Không tìm thấy tệp: " + filename);
        }
    }

    @Override
    public void deleteFile(String subDir, String filename) {
        try {
            Path filePath = Paths.get(uploadDir, subDir).resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileException("Không thể xóa tệp: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

}
