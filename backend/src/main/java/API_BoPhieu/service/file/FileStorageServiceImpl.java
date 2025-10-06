package API_BoPhieu.service.file;

import java.io.IOException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import API_BoPhieu.exception.FileException;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${gcs.bucket-name}")
    private String bucketName;

    private final Storage storage = StorageOptions.getDefaultInstance().getService();

    @Override
    public String storeFile(MultipartFile file, String subDir, String prefix) {
        try {
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String newFilename = prefix + "_" + System.currentTimeMillis() + fileExtension;

            String blobName = subDir + "/" + newFilename;

            BlobId blobId = BlobId.of(bucketName, blobName);

            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .build();

            storage.create(blobInfo, file.getBytes());

            return newFilename;

        } catch (IOException e) {
            throw new FileException("Không thể lưu trữ tệp. Vui lòng thử lại!");
        }
    }

    @Override
    public String getSignedUrl(String subDir, String filename) {
        String blobName = subDir + "/" + filename;
        BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(bucketName, blobName)).build();
        URL url = storage.signUrl(blobInfo, 7, TimeUnit.DAYS, Storage.SignUrlOption.withV4Signature());
        return url.toString();
    }

    @Override
    public void deleteFile(String subDir, String filename) {
        try {
            String blobName = subDir + "/" + filename;
            BlobId blobId = BlobId.of(bucketName, blobName);

            boolean deleted = storage.delete(blobId);
            if (!deleted) {
                throw new FileException("Tệp không tồn tại hoặc không thể xóa.");
            }
        } catch (Exception e) {
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
