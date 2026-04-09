// # 2. Login, Logout, and Token Exchange logic
import axios from 'axios';
import { AUTH_CONFIG } from '../config/auth';

export const authService = {
  // 1. Redirect user to PNB Login
  login: () => {
  // ✅ Step 1: Generate state
  const state = Math.random().toString(36).substring(7);

  // ✅ Step 2: Store it
  sessionStorage.setItem("oauth_state", state);

  // ✅ Step 3: Use it in params
  const params = new URLSearchParams({
    client_id: AUTH_CONFIG.clientId,
    redirect_uri: AUTH_CONFIG.redirectUri,
    response_type: 'code',
    scope: AUTH_CONFIG.scopes,
    state: state, // ✅ now it's defined
  });

  console.log("params", params.toString());

  window.location.href = `${AUTH_CONFIG.authEndpoint}?${params.toString()}`;
},

  // 2. Exchange the ?code= for a real Access Token
  exchangeCodeForToken: async (code) => {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: AUTH_CONFIG.clientId,
      redirect_uri: AUTH_CONFIG.redirectUri,
      code: code,
    });

    try {
      const response = await axios.post(AUTH_CONFIG.tokenEndpoint, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      // Save token securely (sessionStorage clears when browser closes)
      sessionStorage.setItem('access_token', response.data.access_token);
      return response.data;
    } catch (error) {
      console.error("Token exchange failed:", error);
      throw error;
    }
  },

  // 3. Clear session and logout
  logout: () => {
    // 1. Clear all local state
    sessionStorage.clear();
    localStorage.clear();

    // 2. Build the proper GoAuthentik Logout URL
    const redirectUri = encodeURIComponent(window.location.origin + '/login');
    const logoutUrl = `${AUTH_CONFIG.logoutEndpoint}?client_id=${AUTH_CONFIG.clientId}&post_logout_redirect_uri=${redirectUri}`;
    
    // 3. Force browser to leave the React app and hit the Auth Server
    window.location.href = logoutUrl;
  },

  // 4. Check if user is authenticated
  isAuthenticated: () => {
    return !!sessionStorage.getItem('access_token');
  }
};