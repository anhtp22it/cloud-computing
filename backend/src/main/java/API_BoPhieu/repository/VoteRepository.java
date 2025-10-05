package API_BoPhieu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import API_BoPhieu.entity.Vote;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Integer> {
    List<Vote> findByPollId(Integer pollId);

    List<Vote> findByPollIdAndUserId(Integer pollId, Integer userId);

    boolean existsByPollIdAndUserId(Integer pollId, Integer userId);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.pollId = :pollId")
    Integer countVotesByPollId(@Param("pollId") Integer pollId);

    @Query("SELECT COUNT(DISTINCT v.userId) FROM Vote v WHERE v.pollId = :pollId")
    Integer countDistinctVotersByPollId(@Param("pollId") Integer pollId);

    @Query("SELECT v.optionId, COUNT(v) FROM Vote v WHERE v.pollId = :pollId GROUP BY v.optionId")
    List<Object[]> countVotesByOptionAndPollId(@Param("pollId") Integer pollId);
}
