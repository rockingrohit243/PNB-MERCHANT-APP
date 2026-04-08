import React, { useEffect } from 'react';
import { authService } from '../services/authService';
import pnbLogo from '../assets/pnb-logo.png'; // Make sure this image is in your assets folder

const Login = () => {
  useEffect(() => {
    // Instantly redirects the browser to the PNB Authentik login screen
    authService.login();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
      {/* Fallback loading screen while the redirect happens */}
      <img src={pnbLogo} alt="PNB Logo" className="h-16 mb-6 animate-pulse" />
      <p className="text-gray-600 font-medium">Taking you to secure login...</p>
      <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-[#a32a29]"></div>
    </div>
  );
};

export default Login;