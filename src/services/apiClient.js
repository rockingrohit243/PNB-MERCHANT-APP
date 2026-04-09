// # 3. Global Axios Interceptor(from earlier)
import axios from 'axios';

// Initialize with your Staging Backend URL
const apiClient = axios.create({
    baseURL: 'https://auth-dev-stage.iserveu.online', // Replace with your actual backend URL if different
});

// Request Interceptor to auto-attach tokens
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');

    if (token) {
        console.log("token is present", token)
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Inject your global Pass Key
    config.headers['Pass_key'] = 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA';

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;