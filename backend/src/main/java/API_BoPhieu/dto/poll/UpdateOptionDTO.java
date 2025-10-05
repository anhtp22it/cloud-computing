package API_BoPhieu.dto.poll;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOptionDTO {
    @JsonProperty("option_id")
    private Integer optionId;
    private String content;
    @JsonProperty("image_url")
    private String imageUrl;
}
