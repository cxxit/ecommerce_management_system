package com.nexus.backend.registration.config;


import com.nexus.backend.registration.converter.GenderWritingConverter;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jdbc.repository.config.AbstractJdbcConfiguration;

import java.util.List;

@Configuration
public class JdbcConfig extends AbstractJdbcConfiguration {
    @Override
    protected List<?> userConverters() {
        return List.of(new GenderWritingConverter());
    }
}
