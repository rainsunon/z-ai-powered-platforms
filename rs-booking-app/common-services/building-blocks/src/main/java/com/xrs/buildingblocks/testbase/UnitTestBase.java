package com.xrs.buildingblocks.testbase;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;

/**
 * @author Rui S.
 * @date 2026-02-01
 * @apiNote
 */
public class UnitTestBase {
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }
}
