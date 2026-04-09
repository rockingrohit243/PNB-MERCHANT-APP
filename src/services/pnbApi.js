import apiClient from './apiClient';
import { encryptRequestData, decodeApiResponse } from '../utils/cryptoUtils';
import { AUTH_CONFIG } from '../config/auth';
import axios from 'axios';

export const pnbApi = {
    // 1. Accept the fully prepared object directly from the Dashboard for mobilenumber and VPA wise fetch
    fetchById: async (requestBody) => {
        try {
            // 2. Encrypt the dynamically passed payload (e.g., { mobile_number: "..." } or { vpa_id: "..." })
            const encrypted = encryptRequestData(requestBody);

            // 3. Wrap in RequestData (PascalCase as per your Postman)
            const body = {
                RequestData: encrypted
            };

            console.log(">>> Sending Request:", body);

            const response = await apiClient.post('/pnb/fetch/fetchById', body);
            console.log("<<< Received Response:", response.data);

            // 4. Decrypt and Log
            const decryptedData = decodeApiResponse(response.data);

            return decryptedData;
        } catch (error) {
            console.error("fetchById Error:", error.response?.data || error.message);
            throw error;
        }
    },


    // 2. Reports: Fetch transactions based on date range
    fetchReports: async (startDate, endDate) => {
        try {
            const response = await apiClient.post('/pnb/report', {
                start_date: startDate,
                end_date: endDate
            });
            return response.data;
        } catch (error) {
            console.error("Error in fetchReports API:", error);
            throw error;
        }
    },

    
    // 3. QR Page: Convert raw QR string to Base64 Image
    convertToQRBase64: async (qrStringParam) => {
        try {
            // 1. Prepare the raw payload
            const rawPayload = { qrString: qrStringParam };
            
            // 2. Encrypt the payload because auth-dev-stage requires it
            const encrypted = encryptRequestData(rawPayload);
            
            // 3. Wrap it in RequestData
            const body = {
                RequestData: encrypted
            };

            console.log(">>> Sending Encrypted QR Request:", body);

            // 4. Send via apiClient to attach the Pass_key automatically
            const response = await apiClient.post(AUTH_CONFIG.qrConvertUrl, body);
            
            // NOTE: If the API returns an encrypted response as well, 
            // you will need to change this to: return decodeApiResponse(response.data);
            return decodeApiResponse(response.data); 

        } catch (error) {
            console.error("Error in convertToQRBase64 API:", error.response?.data || error.message);
            throw error;
        }
    },

    // 4. Settings: Language Management
    getCurrentLanguage: async (tid) => {
        try {
            const url = `${AUTH_CONFIG.getCurrentLanguageUrl}/${tid}`;
            const response = await apiClient.get(url);
            
            // DECRYPT THE RESPONSE HERE
            const decryptedData = decodeApiResponse(response.data);
            return decryptedData;
        } catch (error) {
            console.error("Error in getCurrentLanguage API:", error.response?.data || error.message);
            throw error;
        }
    },

    fetchAllLanguages: async () => {
        try {
            const response = await apiClient.get(AUTH_CONFIG.fetchAllLanguageUrl);
            
            // DECRYPT THE RESPONSE HERE
            const decryptedData = decodeApiResponse(response.data);
            return decryptedData;
        } catch (error) {
            console.error("Error in fetchAllLanguages API:", error.response?.data || error.message);
            throw error;
        }
    },

    updateLanguage: async (tid, lang) => {
        try {
            const rawPayload = {
                tid: tid,
                update_language: lang
            };

            const encrypted = encryptRequestData(rawPayload);
            const body = { RequestData: encrypted };

            console.log(">>> Sending Language Update Request:", body);

            const response = await apiClient.post(AUTH_CONFIG.updateLanguageUrl, body);
            
            // DECRYPT THE RESPONSE HERE
            const decryptedData = decodeApiResponse(response.data);
            return decryptedData;
        } catch (error) {
            console.error("Error in updateLanguage API:", error.response?.data || error.message);
            throw error;
        }
    },
    


    fetchUsersByDate: async (fromDate, toDate) => {
        try {
            const body = {
                from_date: fromDate,
                to_date: toDate
            };

            const response = await apiClient.post(
                '/pnb/fetch/fetch-users',
                body
            );

            console.log("FETCH USERS RESPONSE:", response.data);

            return response.data; // { data: [...], totalRows }
        } catch (error) {
            console.error("Error in fetchUsersByDate:", error);
            throw error;
        }
    },




   // Submit Query for Transaction Reports (Using absolute URL from auth.js)
    submitReportQuery: async (payload) => {
        try {
            console.log(">>> Sending Raw Report Request:", payload);
            
            // Axios will use this absolute URL and ignore the auth-dev-stage baseURL
            const response = await apiClient.post(AUTH_CONFIG.reportSubmitUrl, payload);
            return response.data;
        } catch (error) {
            console.error("submitReportQuery Error:", error.response?.data || error.message);
            throw error;
        }
    },

    // Get Report Download Status (Using absolute URL from auth.js)
    getReportStatus: async (queryId) => {
        try {
            // Append the queryId dynamically to the base status URL
            const url = `${AUTH_CONFIG.reportStatusUrl}/${queryId}`;
            
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error("getReportStatus Error:", error.response?.data || error.message);
            throw error;
        }
    },
};