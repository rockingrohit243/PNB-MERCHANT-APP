// Global Axios Interceptor
import axios from 'axios';
import { AUTH_CONFIG } from '../config/auth';

// Initialize with  Staging Backend URL
const apiClient = axios.create({
    baseURL: AUTH_CONFIG.apiBaseUrl, 
});

// Request Interceptor to auto-attach tokens
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');

    if (token) {
        //  Authorization header
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['Pass_key'] = AUTH_CONFIG.passKey;

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;