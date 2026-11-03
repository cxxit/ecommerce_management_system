package com.nexus.backend.registration.converter;

import com.nexus.backend.registration.model.Gender;
import org.postgresql.util.PGobject;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;

@WritingConverter
public class GenderWritingConverter implements Converter<Gender, PGobject> {

    @Override
    public PGobject convert(Gender gender) {
        PGobject value = new PGobject();
        value.setType("gender_type");
        try {
            value.setValue(gender.getDatabaseValue());
        } catch (java.sql.SQLException e) {
            throw new IllegalArgumentException(e);
        }
        return value;
    }
}