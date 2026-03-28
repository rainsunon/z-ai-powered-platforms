package com.github.dimitryivaniuta.multitenant.api;

import com.github.dimitryivaniuta.multitenant.api.dto.CreateUserRequest;
import com.github.dimitryivaniuta.multitenant.api.dto.UserResponse;
import com.github.dimitryivaniuta.multitenant.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for tenant-scoped users.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public UserResponse create(@Valid @org.springframework.web.bind.annotation.RequestBody CreateUserRequest req) {
    return userService.create(req);
  }

  @GetMapping("/{id}")
  public UserResponse get(@PathVariable UUID id) {
    return userService.get(id);
  }

  @GetMapping
  public List<UserResponse> list() {
    return userService.list();
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID id) {
    userService.delete(id);
  }
}
