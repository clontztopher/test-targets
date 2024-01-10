package common;

import java.io.FileInputStream;
import java.util.Properties;

public class TestProperties {
    private static final String publicPropPath = "public.properties";
    private static final String privatePropPath = "private.properties";
    private static Properties publicProperties;
    private static Properties privateProperties;


    private TestProperties() {}

    public static Object getPublicProperty(String property) {
        if (publicProperties == null) {
            publicProperties = new Properties();
            try {
                publicProperties.load(new FileInputStream(publicPropPath));
            } catch(Exception e) {
                e.printStackTrace();
                return null;
            }

        }
        return publicProperties.get(property);
    }

    public static Object getPrivateProperty(String property) {
        if (privateProperties == null) {
            privateProperties = new Properties();
            try {
                privateProperties.load(new FileInputStream(privatePropPath));
            } catch(Exception e) {
                e.printStackTrace();
                return null;
            }

        }
        return privateProperties.get(property);
    }

    public enum PropName {
        BASE_URL("BASE_URL"),
        SAMPLE_TODO_ONE("SAMPLE_TODO_ONE"),
        SAMPLE_TODO_TWO("SAMPLE_TODO_TWO"),
        SAMPLE_TODO_THREE("SAMPLE_TODO_THREE");


        private String propertyName;

        PropName(String prop) {
            this.propertyName = prop;
        }

        @Override
        public String toString() {
            return this.propertyName;
        }
    }
}
