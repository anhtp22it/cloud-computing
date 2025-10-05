package API_BoPhieu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import API_BoPhieu.entity.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Integer> {
    List<Option> findByPollId(Integer pollId);
}
