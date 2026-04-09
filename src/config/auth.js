// # 1. PNB OIDC URLs and Client ID
export const AUTH_CONFIG = {
    clientId: 'SaDG8kozoNOUC07Uv46et8',
    redirectUri: 'http://localhost:3000/redirected',
    newUrl: "https://auth-dev-stage.iserveu.online/pnb/fetch/fetchById",
    authEndpoint: 'https://pnb-auth-stage.isupay.in/application/o/authorize/',
    tokenEndpoint: 'https://pnb-auth-stage.isupay.in/application/o/token/',
    logoutEndpoint: 'https://pnb-auth-stage.isupay.in/application/o/pnb/end-session/',
    scopes: 'openid profile email offline_access authorities privileges user_name created adminName bankCode goauthentik.io/api',
    
};