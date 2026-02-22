package com.xrs.gateway.botdefense.web;

import com.xrs.gateway.botdefense.config.BotDefenseProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.Locale;

/**
 * Matches incoming requests to a configured route group.
 */
@Component
public class RouteGroupMatcher {

    private final BotDefenseProperties props;
    private final AntPathMatcher matcher = new AntPathMatcher();

    public RouteGroupMatcher(BotDefenseProperties props) {
        this.props = props;
    }

    /**
     * Returns the matched group name or {@code null} if not protected.
     */
    public String match(String method, String path) {
        String m = method.toUpperCase(Locale.ROOT);
        for (BotDefenseProperties.RouteGroup rg : props.getRouteGroups()) {
            if (rg.getMethods().stream().map(s -> s.toUpperCase(Locale.ROOT)).noneMatch(m::equals)) {
                continue;
            }
            for (String pattern : rg.getPaths()) {
                if (matcher.match(pattern, path)) {
                    return rg.getName();
                }
            }
        }
        return null;
    }
}
