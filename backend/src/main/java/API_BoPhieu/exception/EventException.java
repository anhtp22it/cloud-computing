package API_BoPhieu.exception;


public class EventException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final int status;

    private final String path;

    public EventException(String message) {
        this(message, 400, null);
    }

    public EventException(String message, int status) {
        this(message, status, null);
    }

    public EventException(String message, int status, String path) {
        super(message);
        this.status = status;
        this.path   = path;
    }

    public int getStatus() {
        return status;
    }

    public String getPath() {
        return path;
    }
}
