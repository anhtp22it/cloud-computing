package API_BoPhieu.common;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

public abstract class AbstractCrudService<T, ID extends Serializable> {

    protected final JpaRepository<T, ID> repo;

    protected AbstractCrudService(JpaRepository<T, ID> repo) {
        this.repo = repo;
    }

    /* ---------- READ ---------- */
    @Transactional(readOnly = true)
    public List<T> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public T findById(ID id) {
        return repo.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Không tìm thấy bản ghi id=" + id));
    }

    /* ---------- CREATE / UPDATE ---------- */
    @Transactional
    public T save(T entity) {          // tạo mới / cập nhật
        return repo.save(entity);
    }

    /* ---------- DELETE ---------- */
    @Transactional
    public void deleteById(ID id) {
        repo.deleteById(id);
    }
}
