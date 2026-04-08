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
            // Exchange the URL code for the actual access token
            authService.exchangeCodeForToken(code)
                .then(() => {
                    // Success! Send them to the Dashboard immediately
                    navigate('/', { replace: true });
                })
                .catch((err) => {
                    console.error("Token exchange failed", err);
                    setError('Authentication failed. Please try logging in again.');
                });
        } else {
            setError('No authorization code found.');
        }
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-[#a32a29] text-white rounded">
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a32a29]"></div>
            <p className="mt-4 text-gray-600 font-medium">Verifying session...</p>
        </div>
    );
};

export default AuthCallback;