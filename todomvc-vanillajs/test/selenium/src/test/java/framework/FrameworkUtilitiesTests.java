package framework;

import org.testng.annotations.Test;

import static common.TestProperties.PropName.BASE_URL;
import static common.TestProperties.getPublicProperty;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNull;

public class FrameworkUtilitiesTests {

    @Test
    public void TestPropertiesWorksAsExpected() {
        assertEquals(getPublicProperty(BASE_URL.toString()), "https://todomvc-vanillajs.test-targets.dev/");
    }
}
