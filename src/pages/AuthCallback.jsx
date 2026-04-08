// # 5. The hidden /redirected processing route
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      // Exchange code for token
      authService.exchangeCodeForToken(code)
        .then(() => {
          // Success! Send them to the Dashboard
          navigate('/', { replace: true });
        })
        .catch((err) => {
          setError('Authentication failed. Please try again.');
        });
    } else {
      setError('No authorization code found in URL.');
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button 
          onClick={() => navigate('/login')} 
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 animate-pulse">Authenticating with PNB...</p>
    </div>
  );
};

export default AuthCallback;