export const authConfig = {
    clientId: 'oauth2-pkce-client',
    authorizationEndpoint: 'https://13.205.8.126:8443/realms/fitness-oauth2/protocol/openid-connect/auth',
    tokenEndpoint: 'https://13.205.8.126:8443/realms/fitness-oauth2/protocol/openid-connect/token',

    redirectUri: 'https://fitness-tracker-microservices.netlify.app/',

    
    scope: 'openid profile email offline_access',
    onRefreshTokenExpire: (event) => event.logIn(),
  }
