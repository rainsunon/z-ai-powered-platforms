export const AUTH_CONFIG = {
  jwtIssuer: "novastone-api",
  jwtAudience: "novastone-app",
  jwtExpiration: "15m",
  defaultRole: "user",
} as const;
