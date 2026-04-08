// # Simple page with a "Login with PNB" button
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // IF USING OIDC REDIRECT (Recommended based on your initial docs):
    // authService.login();
    
    // IF USING DIRECT CREDENTIALS (If your backend allows it now):
    // authService.exchangeCredentialsForToken(username, password)
    //  .then(() => navigate('/'))
    //  .catch(err => console.error("Login failed", err));

    console.log("Login triggered for:", username);
    // Placeholder redirect for now
    navigate('/'); 
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center bg-[#f8f9fa] overflow-hidden">
      
      {/* Decorative blurred background elements matching Figma */}
      <div className="absolute left-[-10%] top-1/4 w-96 h-96 bg-yellow-400 opacity-40 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute right-[-10%] bottom-1/4 w-96 h-96 bg-red-600 opacity-20 rounded-full blur-3xl mix-blend-multiply"></div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white p-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        
        {/* Logo Placeholder (Replace src with your actual asset) */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/PNB_Logo.svg/512px-PNB_Logo.svg.png" 
            alt="PNB Logo" 
            className="h-10 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login to your Account
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a32a29] focus:border-transparent transition-all"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a32a29] focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* SVG Eye Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded text-[#a32a29] focus:ring-[#a32a29]" />
              Remember Me
            </label>
            <a href="#" className="text-[#a32a29] font-medium hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#a32a29] hover:bg-[#8a2322] text-white font-semibold py-3 rounded-md transition-colors duration-200 mt-4 shadow-md"
          >
            Login
          </button>
        </form>
      </div>

      {/* Footer Links */}
      <div className="absolute bottom-6 flex space-x-6 text-xs text-gray-500 z-10">
        <a href="#" className="hover:text-gray-800 transition-colors">Terms and Conditions</a>
        <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
      </div>
    </div>
  );
};

export default Login;