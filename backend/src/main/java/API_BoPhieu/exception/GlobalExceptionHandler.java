package API_BoPhieu.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Void> handleStaticNotFound(NoResourceFoundException ex,
            HttpServletRequest req) {
        log.warn("Tài nguyên tĩnh NOT FOUND: {} {}", req.getMethod(), req.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        log.warn("405 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
        return build(HttpStatus.METHOD_NOT_ALLOWED, "Phương thức không được hỗ trợ",
                ex.getMessage(), req);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuth(AuthException ex, HttpServletRequest req) {
        log.warn("401 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
        return build(HttpStatus.UNAUTHORIZED, "Lỗi xác thực", ex.getMessage(), req);
    }

    @ExceptionHandler(EventException.class)
    public ResponseEntity<ErrorResponse> handleEvent(EventException ex, HttpServletRequest req) {
        log.warn("400 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
        return build(HttpStatus.BAD_REQUEST, "Yêu cầu không hợp lệ", ex.getMessage(), req);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
            HttpServletRequest req) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + " " + err.getDefaultMessage()).findFirst()
                .orElse("Lỗi xác thực dữ liệu");
        log.warn("400 {} {} - {}", req.getMethod(), req.getRequestURI(), msg);
        return build(HttpStatus.BAD_REQUEST, "Yêu cầu không hợp lệ", msg, req);
    }

    @ExceptionHandler(PollException.class)
    public ResponseEntity<ErrorResponse> handlePoll(PollException ex, HttpServletRequest req) {
        log.warn("400 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
        return build(HttpStatus.BAD_REQUEST, "Yêu cầu không hợp lệ", ex.getMessage(), req);
    }

    @ExceptionHandler({ResourceNotFoundException.class, NotFoundException.class})
    public ResponseEntity<ErrorResponse> handleNotFound(RuntimeException ex,
            HttpServletRequest req) {
        log.warn("404 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
        return build(HttpStatus.NOT_FOUND, "Không tìm thấy tài nguyên", ex.getMessage(), req);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex,
            HttpServletRequest req) {
        log.warn("409 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
        return build(HttpStatus.CONFLICT, "Xung đột dữ liệu", ex.getMessage(), req);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleOther(Exception ex, HttpServletRequest req) {
        log.error("500 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ nội bộ",
                "Đã có lỗi xảy ra ở máy chủ, vui lòng thử lại sau.", req);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex,
            HttpServletRequest req) {
        log.warn("400 {} {} - {}", req.getMethod(), req.getRequestURI(), ex.getMessage());
        return build(HttpStatus.BAD_REQUEST, "Tham số không hợp lệ", ex.getMessage(), req);
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String title, String message,
            HttpServletRequest req) {
        ErrorResponse body = new ErrorResponse(status.value(), title, message, req.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }
}
