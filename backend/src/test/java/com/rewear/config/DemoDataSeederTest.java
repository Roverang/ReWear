package com.rewear.config;

import com.rewear.entity.User;
import com.rewear.repository.ItemRepository;
import com.rewear.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The seeder bean only exists in the dev profile, so it is constructed by hand here
 * (the dev profile would also try to read backend.env).
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DemoDataSeederTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void seedsDemoUserAndItemsOnlyOnce() {
        DemoDataSeeder seeder = new DemoDataSeeder(userRepository, itemRepository, passwordEncoder,
                new DemoProperties("Demo@ReWear.app", "rewear-demo-123"));
        long itemsBefore = itemRepository.count();

        seeder.run(null);
        seeder.run(null);

        User demo = userRepository.findByEmail("demo@rewear.app").orElseThrow();
        assertThat(passwordEncoder.matches("rewear-demo-123", demo.getPasswordHash())).isTrue();
        assertThat(itemRepository.count() - itemsBefore).isEqualTo(8);
    }
}
