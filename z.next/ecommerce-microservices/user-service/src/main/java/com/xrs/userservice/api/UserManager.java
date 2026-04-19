package com.xrs.userservice.api;

import com.xrs.userservice.exception.wrapper.TokenErrorOrAccessTimeOut;
import com.xrs.userservice.http.HeaderGenerator;
import com.xrs.userservice.model.dto.request.ChangePasswordRequest;
import com.xrs.userservice.model.dto.request.SignUp;
import com.xrs.userservice.model.dto.request.UserDto;
import com.xrs.userservice.model.dto.response.ResponseMessage;
import com.xrs.userservice.security.jwt.JwtProvider;
import com.xrs.userservice.service.UserService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/manager")
public class UserManager {
    private static final Logger log = LoggerFactory.getLogger(UserManager.class);
    private final ModelMapper modelMapper;

    private final UserService userService;
    private final HeaderGenerator headerGenerator;
    private final JwtProvider jwtProvider;

    @Autowired
    public UserManager(UserService userService, HeaderGenerator headerGenerator, JwtProvider jwtProvider,
                    ModelMapper modelMapper) {
        this.userService = userService;
        this.headerGenerator = headerGenerator;
        this.jwtProvider = jwtProvider;
        this.modelMapper = modelMapper;
    }

    @PutMapping("update/{id}")
    @PreAuthorize("isAuthenticated() and hasAuthority('USER')")
    public Mono<ResponseEntity<ResponseMessage>> update(@PathVariable("id") Long id,
                    @RequestBody SignUp updateDTO) {
        return userService.update(id, updateDTO)
                        .flatMap(user -> Mono.just(new ResponseEntity<>(
                                        new ResponseMessage("Update user: " + updateDTO.getUsername()
                                                        + " successfully."),
                                        HttpStatus.OK)))
                        .onErrorResume(
                                        error -> Mono.just(new ResponseEntity<>(
                                                        new ResponseMessage("Update user: "
                                                                        + updateDTO.getUsername() + " failed "
                                                                        + error.getMessage()),
                                                        HttpStatus.BAD_REQUEST)));
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated() and hasAuthority('USER')")
    public Mono<String> changePassword(@RequestBody ChangePasswordRequest request) {
        return userService.changePassword(request);
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated() and (hasAuthority('USER') or hasAuthority('ADMIN'))")
    public Mono<String> delete(@PathVariable("id") Long id) {
        return userService.delete(id);
    }

    @GetMapping("/user")
    @PreAuthorize("(isAuthenticated() and (hasAuthority('USER') and principal.username == #username) or hasAuthority('ADMIN'))")
    public Mono<ResponseEntity<?>> getUserByUsername(@RequestParam(value = "username") String username) {
        return userService.findByUsername(username)
                        .map(user -> modelMapper.map(user, UserDto.class))
                        .<ResponseEntity<?>>map(userDto -> new ResponseEntity<>(userDto,
                                        headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.OK))
                        .defaultIfEmpty(new ResponseEntity<>(null, headerGenerator.getHeadersForError(),
                                        HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER') and principal.id == #id")
    public Mono<ResponseEntity<?>> getUserById(@PathVariable("id") Long id) {
        return userService.findById(id)
                        .map(user -> modelMapper.map(user, UserDto.class))
                        .<ResponseEntity<?>>map(userDto -> new ResponseEntity<>(userDto,
                                        headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.OK))
                        .defaultIfEmpty(new ResponseEntity<>(null, headerGenerator.getHeadersForError(),
                                        HttpStatus.NOT_FOUND));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Mono<ResponseEntity<Page<UserDto>>> getAllUsers(@RequestParam(defaultValue = "0") int page,
                    @RequestParam(defaultValue = "10") int size,
                    @RequestParam(defaultValue = "id") String sortBy,
                    @RequestParam(defaultValue = "ASC") String sortOrder) {

        return userService.findAllUsers(page, size, sortBy, sortOrder)
                        .map(usersPage -> new ResponseEntity<>(usersPage,
                                        headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.OK));
    }

    @GetMapping("/info")
    public Mono<ResponseEntity<?>> getUserInfo(@RequestHeader("Authorization") String token) {
        String username = jwtProvider.getUserNameFromToken(token);
        return userService.findByUsername(username)
                        .map(user -> modelMapper.map(user, UserDto.class))
                        .<ResponseEntity<?>>map(userDto -> new ResponseEntity<>(userDto,
                                        headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.OK))
                        .switchIfEmpty(Mono
                                        .error(new TokenErrorOrAccessTimeOut("Token error or access timeout")));
    }

}
