package com.deliverymanagement;

import com.deliverymanagement.model.DeliveryAgent;
import com.deliverymanagement.model.Role;
import com.deliverymanagement.model.User;
import com.deliverymanagement.repository.DeliveryAgentRepository;
import com.deliverymanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Fix role values for existing users created before DELIVERY_AGENT role was supported.
 *
 * Heuristic:
 * - Only updates users whose current role is CUSTOMER
 * - Only updates when user's username (full name) EXACTLY matches a delivery agent name
 *
 * This is intentionally conservative to avoid changing real customers.
 */
@Component
public class RoleMigrationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RoleMigrationRunner.class);

    private final UserRepository userRepository;
    private final DeliveryAgentRepository deliveryAgentRepository;

    public RoleMigrationRunner(UserRepository userRepository,
                                DeliveryAgentRepository deliveryAgentRepository) {
        this.userRepository = userRepository;
        this.deliveryAgentRepository = deliveryAgentRepository;
    }

    @Override
    public void run(String... args) {
        List<DeliveryAgent> agents = deliveryAgentRepository.findAll();
        if (agents == null || agents.isEmpty()) {
            log.info("[RoleMigration] No delivery agents found; skipping delivery-agent role migration.");
            return;
        }

        Set<String> agentNamesLower = new HashSet<>();
        for (DeliveryAgent agent : agents) {
            if (agent.getName() != null && !agent.getName().isBlank()) {
                agentNamesLower.add(agent.getName().trim().toLowerCase(Locale.ROOT));
            }
        }

        if (agentNamesLower.isEmpty()) {
            log.info("[RoleMigration] Delivery agent names are empty; skipping delivery-agent role migration.");
            return;
        }

        List<User> users = userRepository.findAll();
        int updated = 0;

        for (User user : users) {
            if (user.getRole() != Role.CUSTOMER) continue;
            if (user.getUsername() == null || user.getUsername().isBlank()) continue;

            String usernameLower = user.getUsername().trim().toLowerCase(Locale.ROOT);
            if (!agentNamesLower.contains(usernameLower)) continue;

            user.setRole(Role.DELIVERY_AGENT);
            userRepository.save(user);
            updated++;
            log.info("[RoleMigration] Updated user username={} email={} role=CUSTOMER -> DELIVERY_AGENT",
                    user.getUsername(), user.getEmail());
        }

        log.info("[RoleMigration] Completed. Updated {} user(s).", updated);
    }
}

