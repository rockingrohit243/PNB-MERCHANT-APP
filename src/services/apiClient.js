// # 3. Global Axios Interceptor(from earlier)
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Initialize with your Staging Backend URL
const apiClient = axios.create({
    baseURL: 'https://auth-dev-stage.iserveu.online', // Replace with your actual backend URL if different
});

// Request Interceptor to auto-attach tokens
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('access_token');

    if (token) {
        // ✅ Add Authorization header
        config.headers.Authorization = `Bearer ${token}`;

        try {
            // ✅ Decode token
            const decoded = jwtDecode(token);

            // ✅ Map fields EXACTLY as backend expects
            const tokenProperties = {
                userName: decoded.user_name,              // ✅ mapping
                adminName: decoded.adminName,
                role: decoded.authorities?.[0],           // ✅ array → single value
                bankCode: decoded.bankCode,
            };

            // ✅ Send as header (MOST LIKELY REQUIRED)
            //    config.headers['X-tokenProperties'] = JSON.stringify(tokenProperties);

            console.log("token is present", token)
            // config.headers['Authorization'] = `token`;
        }
        catch (error) {
            console.error("JWT decode failed", error);
        }
    }

    // Inject your global Pass Key
    config.headers['Pass_key'] = 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA';

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;