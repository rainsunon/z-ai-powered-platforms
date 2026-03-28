package com.ofo.paymentservice.security;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.google.common.collect.Sets;

public enum ApplicationRole {

    USER(Sets.newHashSet(ApplicationPermission.OFO_USER)),
    ADMIN(Sets.newHashSet(ApplicationPermission.OFO_ADMIN));

	    private Set<ApplicationPermission> permissions;

	    ApplicationRole(Set<ApplicationPermission> permissions) {
	        this.permissions = permissions;
	    }

	    public Set<ApplicationPermission> getPermissions(){
	        return this.getPermissions();
	    }

	    public Set<SimpleGrantedAuthority> getAuthorities(){
	        Set<SimpleGrantedAuthority> authorities = permissions.stream().map(
	                p-> new SimpleGrantedAuthority(p.name()))
	                .collect(Collectors.toSet());
	        authorities.add(new SimpleGrantedAuthority("ROLE_"+this.name()));
	        return authorities;
	    }
}
