import apiClient from './apiClient';

export const pnbApi = {
    // 1. Dashboard: Fetch Merchant Details and VPAs
    fetchById: async (merchantId) => {
        try {
            const response = await apiClient.post('/pnb/fetch/fetchById', {
                merchant_id: merchantId
            });
            return response.data;
        } catch (error) {
            console.error("Error in fetchById API:", error);
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