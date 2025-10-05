package API_BoPhieu.config;

import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public ObjectMapper redisObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL);
        return objectMapper;
    }

    @Bean
    public RedisCacheConfiguration defaultCacheConfiguration(ObjectMapper redisObjectMapper) {
        GenericJackson2JsonRedisSerializer redisSerializer =
                new GenericJackson2JsonRedisSerializer(redisObjectMapper);

        return RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(60))
                .disableCachingNullValues()
                .serializeValuesWith(SerializationPair.fromSerializer(redisSerializer));
    }

    @Bean
    public GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer(
            ObjectMapper redisObjectMapper) {
        return new GenericJackson2JsonRedisSerializer(redisObjectMapper);
    }

    @Bean("listKeyGen")
    public KeyGenerator listKeyGen() {
        return (target, method, params) -> Arrays.stream(params)
                .map(p -> p == null ? "null" : p.toString()).collect(Collectors.joining("|"));
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory,
            RedisCacheConfiguration defaultCacheConfiguration) {

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        cacheConfigurations.put("EVENT_DETAIL",
                defaultCacheConfiguration.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put("EVENT_LIST",
                defaultCacheConfiguration.entryTtl(Duration.ofSeconds(60)));
        cacheConfigurations.put("MANAGED_EVENTS",
                defaultCacheConfiguration.entryTtl(Duration.ofSeconds(90)));
        cacheConfigurations.put("PARTICIPANTS_BY_EVENT",
                defaultCacheConfiguration.entryTtl(Duration.ofSeconds(20)));
        cacheConfigurations.put("QR_IMAGE",
                defaultCacheConfiguration.entryTtl(Duration.ofMinutes(20)));
        cacheConfigurations.put("POLL_DETAIL",
                defaultCacheConfiguration.entryTtl(Duration.ofSeconds(30)));
        cacheConfigurations.put("POLLS_BY_EVENT",
                defaultCacheConfiguration.entryTtl(Duration.ofSeconds(60)));
        cacheConfigurations.put("POLL_STATS",
                defaultCacheConfiguration.entryTtl(Duration.ofSeconds(20)));


        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultCacheConfiguration)
                .withInitialCacheConfigurations(cacheConfigurations).transactionAware().build();
    }

}
