package com.ofo.restaurantservice.security;

import com.google.common.base.Strings;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class JWTTokenVerifier extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
      //  if(Strings.isNullOrEmpty(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")){
        if(Strings.isNullOrEmpty(authorizationHeader)){
            filterChain.doFilter(request,response);
            return;
        }

        try{
            String key = "thisneedstobelongforittobesecure";
            String token = authorizationHeader.replace("Bearer ","");
            Jws<Claims> claimsJws = Jwts.parser().verifyWith(Keys.hmacShaKeyFor(key.getBytes())).build().parseSignedClaims(token);
            String username = claimsJws.getPayload().getSubject();
            var authorities = (List<Map<String,String>>)claimsJws.getPayload().get("authorities");
            Set<SimpleGrantedAuthority> simpleGrantedAuthorities = authorities.stream().map(a-> new SimpleGrantedAuthority(a.get("authority"))).collect(Collectors.toSet());
            Authentication authentication = new UsernamePasswordAuthenticationToken(username,null, simpleGrantedAuthorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }catch (JwtException e){
            throw new IllegalStateException("Token Invalid");
        }
        filterChain.doFilter(request,response);
    }
}
