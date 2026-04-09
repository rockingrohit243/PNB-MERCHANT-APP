import apiClient from './apiClient';
import { encryptRequestData, decodeApiResponse } from '../utils/cryptoUtils';

export const pnbApi = {
  fetchById: async (mobileNumber) => {
    try {
      const rawPayload = { mobile_number: mobileNumber };
      
      // 1. Encrypt
      const encrypted = encryptRequestData(rawPayload);

      // 2. Wrap in RequestData (PascalCase as per your Postman)
      const body = {
        RequestData: encrypted 
      };

      console.log(">>> Sending Request:", body);

      const response = await apiClient.post('/pnb/fetch/fetchById', body);
      console.log("<<< Received Response:", response.data);

      // 3. Decrypt and Log
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
    convertToQRBase64: async (qrString) => {
        try {
            const response = await apiClient.post('/pnb/qr/convertToQRBase64', {
                qr_string: qrString
            });
            return response.data;
        } catch (error) {
            console.error("Error in convertToQRBase64 API:", error);
            throw error;
        }
    },

    // 4. Settings: Language Management
    getCurrentLanguage: async () => {
        try {
            const response = await apiClient.get('/pnb/language/currentLanguage');
            return response.data;
        } catch (error) {
            console.error("Error in getCurrentLanguage API:", error);
            throw error;
        }
    },

    fetchAllLanguages: async () => {
        try {
            const response = await apiClient.get('/pnb/language/fetchAllLanguage');
            return response.data;
        } catch (error) {
            console.error("Error in fetchAllLanguages API:", error);
            throw error;
        }
    },

    updateLanguage: async (langId) => {
        try {
            const response = await apiClient.post('/pnb/language/UpdateLanguage', {
                language_id: langId
            });
            return response.data;
        } catch (error) {
            console.error("Error in updateLanguage API:", error);
            throw error;
        }
    }
};