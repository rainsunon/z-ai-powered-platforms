package com.ofo.security.dao;

import com.ofo.security.model.ApplicationUser;

public interface ApplicationUserDao {
    public ApplicationUser loadUserByUsername(String s);
}
