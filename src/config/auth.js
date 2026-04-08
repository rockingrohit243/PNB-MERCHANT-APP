// # 1. PNB OIDC URLs and Client ID
export const AUTH_CONFIG = {
    clientId: 'SaDG8kozoNOUC07Uv46et8',
    redirectUri: 'http://localhost:3000/redirected',
    authEndpoint: 'https://pnb-auth-stage.isupay.in/application/o/authorize/',
    tokenEndpoint: 'https://pnb-auth-stage.isupay.in/application/o/token/',
    logoutEndpoint: 'https://pnb-auth-stage.isupay.in/application/o/pnb/end-session/',
    scopes: 'openid profile email bankCode',
};