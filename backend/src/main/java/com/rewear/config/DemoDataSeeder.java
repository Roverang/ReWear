package com.rewear.config;

import com.rewear.entity.Gender;
import com.rewear.entity.Item;
import com.rewear.entity.ItemCondition;
import com.rewear.entity.User;
import com.rewear.repository.ItemRepository;
import com.rewear.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Dev profile only: creates the demo user and the seed items from src/lib/mock-data.ts.
 * Runs on every startup but does nothing if the demo email already exists.
 * Image paths are plain strings; the frontend serves the files.
 */
@Component
@Profile("dev")
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;
    private final DemoProperties demoProperties;

    public DemoDataSeeder(UserRepository userRepository, ItemRepository itemRepository,
                          PasswordEncoder passwordEncoder, DemoProperties demoProperties) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.passwordEncoder = passwordEncoder;
        this.demoProperties = demoProperties;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (demoProperties.email() == null || demoProperties.password() == null) {
            throw new IllegalStateException("app.demo.email and app.demo.password must be set in the dev profile");
        }
        String email = demoProperties.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            log.info("Demo data already present, skipping seed");
            return;
        }

        User demo = new User("Demo User", email, passwordEncoder.encode(demoProperties.password()), "DU", "#7FA35B");
        demo.setEcoPoints(10);
        demo.setBadges(new ArrayList<>(List.of("Eco Starter")));
        demo = userRepository.save(demo);

        List<Item> items = itemRepository.saveAll(seedItems(demo));
        log.info("Seeded demo user and {} items", items.size());
    }

    private static List<Item> seedItems(User owner) {
        return List.of(
                item(owner, "Cream Cable Knit Sweater", "Everlane", "Hoodies", ItemCondition.LIKE_NEW, "M",
                        Gender.WOMEN, "Brooklyn, NY", 92, "/assets/item-sweater.jpg",
                        "This cable knit sweater from Everlane is incredibly soft and barely worn — maybe 3 times total. It's a beautiful cream colour that pairs with almost anything. Stored in a smoke-free, pet-free home. Photographed in natural light. Happy to swap for similar quality knitwear in size S–M.",
                        85, 1, 3),
                item(owner, "Vintage Indigo Denim Jacket", "Levi's", "Jackets", ItemCondition.EXCELLENT, "L",
                        Gender.UNISEX, "Austin, TX", 88, "/assets/item-denim.jpg",
                        "Classic Levi's 505 denim jacket in a deep indigo wash. This one has excellent character — subtle fading at the collar and cuffs that gives it that authentic vintage look without being worn out. No rips, tears, or stains. Would love to swap for a quality jacket or coat.",
                        90, 2, 7),
                item(owner, "Olive Oversized Hoodie", "Uniqlo", "Hoodies", ItemCondition.GOOD, "M",
                        Gender.UNISEX, "Portland, OR", 81, "/assets/item-hoodie.jpg",
                        "Uniqlo oversized hoodie in a muted olive green — one of their older colourways that's hard to find now. Slight pilling on the inner lining but barely noticeable when wearing. Super cosy and great for layering. Looking to swap for a similar oversized piece.",
                        70, 3, 2),
                item(owner, "Natural Canvas Tote Bag", "Baggu", "Accessories", ItemCondition.LIKE_NEW, "One Size",
                        Gender.UNISEX, "Seattle, WA", 95, "/assets/item-tote.jpg",
                        "Baggu standard tote in natural canvas — used exactly twice and it still looks brand new. These things are incredibly durable and hold more than you'd expect. Happy to donate this one to a good home — just cover with a swap of any small accessory.",
                        65, 4, 5),
                item(owner, "Off-White Linen Button-Up", "COS", "T-Shirts", ItemCondition.EXCELLENT, "S",
                        Gender.WOMEN, "Chicago, IL", 87, "/assets/item-shirt.jpg",
                        "COS linen shirt in a beautiful off-white. Worn maybe 4 times, always hand-washed and air-dried. Linen gets better with wear and this one has that perfect natural texture. A timeless wardrobe staple. Would swap for another COS or similar quality top.",
                        80, 5, 4),
                item(owner, "Minimal Cream Low-Top Sneakers", "Veja", "Shoes", ItemCondition.GOOD, "9",
                        Gender.UNISEX, "San Francisco, CA", 90, "/assets/item-sneakers.jpg",
                        "Veja V-10 sneakers in cream/white. These are sustainably made and still in great shape — soles are solid, uppers are clean. There are very minor scuffs on the toe box that cleaned up well. Comes with original laces and box. Would love to swap for quality footwear.",
                        95, 6, 6),
                // mock-data.ts reuses the shirt image for the chinos
                item(owner, "Slim Beige Chinos", "Everlane", "Pants", ItemCondition.EXCELLENT, "32",
                        Gender.MEN, "Denver, CO", 84, "/assets/item-shirt.jpg",
                        "Everlane slim chinos in warm beige. These fit true to size and the fabric is that perfect mid-weight that works year-round. Some light wear at the knees but nothing visible when standing. Machine washed cold every time. Would swap for another pair of quality trousers.",
                        75, 7, 1),
                item(owner, "Wool Cable Pullover", "Patagonia", "Hoodies", ItemCondition.LIKE_NEW, "L",
                        Gender.MEN, "Boulder, CO", 93, "/assets/item-sweater.jpg",
                        "Patagonia recycled wool cable pullover — basically new. Received as a gift but it's not quite my style. The wool is incredibly warm and the cable knit pattern is beautiful. Sustainably sourced materials. Would love to swap for an outdoor jacket or technical layer.",
                        110, 8, 9)
        );
    }

    private static Item item(User owner, String title, String brand, String category, ItemCondition condition,
                             String size, Gender gender, String location, int score, String image,
                             String description, int pointValue, int daysAgo, int exchangeCount) {
        Item item = new Item(owner, title, brand, category, condition, size, gender, location,
                score, image, description, pointValue);
        // mock-data.ts uses the same image three times
        item.setImages(new ArrayList<>(List.of(image, image, image)));
        item.setListedAt(Instant.now().minus(Duration.ofDays(daysAgo)));
        item.setExchangeCount(exchangeCount);
        return item;
    }
}
