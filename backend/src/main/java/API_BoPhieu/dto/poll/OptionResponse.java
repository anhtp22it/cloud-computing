package API_BoPhieu.dto.poll;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionResponse {
    private Integer id;
    private String content;
    @JsonProperty("image_url")
    private String imageUrl;
    @JsonProperty("vote_count")
    private Integer voteCount;
}
