package API_BoPhieu.service.attendant;

public interface QRCodeService {
    byte[] generateQRCode(String data) throws Exception;

    String generateQRToken();
}
