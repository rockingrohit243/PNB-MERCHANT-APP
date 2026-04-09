// This file handles state, uses  existing Layout components (Sidebar, Topbar), 
// and implements the complex "Submit" (table view) vs "Download" (polling excel mode) logic
//  required by the document


import React, { useState, useEffect } from 'react';
import { pnbApi } from '../services/pnbApi';
import { getMobileFromToken } from '../utils/authUtils';

// Layout & UI
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTable from '../components/reports/ReportTable';
import ProfileModal from '../components/modals/ProfileModal';

// Helper: Formats JS Date to "DD/MM/YYYY" explicitly required by API
const toDDMMYYYY = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "";
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const TransactionReports = () => {
    // Layout States
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [merchantName, setMerchantName] = useState('');

    // Data States
    const [activeVpa, setActiveVpa] = useState(null);
    const [activeVpaProfile, setActiveVpaProfile] = useState({});
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter States
    const [filterType, setFilterType] = useState('Today'); // 'Today' | 'Monthly' | 'Custom Range'
    const [monthlyOption, setMonthlyOption] = useState('1');
    const [customDates, setCustomDates] = useState({ start: '', end: '' });

    // Loading States
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // 1. Initial Load to get VPA Context
    useEffect(() => {
        const initPage = async () => {
            try {
                const mobile = getMobileFromToken();
                const response = await pnbApi.fetchById({ mobile_number: mobile });
                if (response?.data?.length > 0) {
                    setMerchantName(response.data[0].merchant_name || 'Merchant User');
                    setActiveVpa(response.data[0].vpa_id);
                    setActiveVpaProfile(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch initial profile for reports", error);
            }
        };
        initPage();
    }, []);

    // 2. Fetch "Today" data automatically once we have a VPA
    useEffect(() => {
        if (activeVpa && filterType === 'Today') {
            fetchReportData('both');
        }
        // eslint-disable-next-line
    }, [activeVpa, filterType]);

    // Utility to calculate Start & End dates based on selected filters
    const calculateDateRange = () => {
        const today = new Date();
        let startD = new Date();
        let endD = new Date();

        if (filterType === 'Today') {
            // Keep today
        } else if (filterType === 'Monthly') {
            startD.setMonth(today.getMonth() - parseInt(monthlyOption));
        } else if (filterType === 'Custom Range') {
            startD = new Date(customDates.start);
            endD = new Date(customDates.end);
        }
        return { startDate: toDDMMYYYY(startD), endDate: toDDMMYYYY(endD) };
    };

    // Submit Logic: Fetch data for the Table (mode: 'both' per API spec)
    const fetchReportData = async () => {
        if (!activeVpa) return;
        setIsTableLoading(true);

        try {
            const { startDate, endDate } = calculateDateRange();
            const payload = { startDate, endDate, vpa_id: activeVpa, mode: "both" };

            const res = await pnbApi.submitReportQuery(payload);
            if (res && res.data) {
                setTableData(res.data);
            }
        } catch (error) {
            console.error("Error fetching report data", error);
            setTableData([]);
        } finally {
            setIsTableLoading(false);
        }
    };

    // Download Logic: Use mode 'excel', get query_id, poll for status
    const handleDownload = async () => {
        if (!activeVpa) return;
        setIsDownloading(true);

        try {
            const { startDate, endDate } = calculateDateRange();
            const payload = { startDate, endDate, vpa_id: activeVpa, mode: "excel" };

            // Step 1: Request Excel generation
            const res = await pnbApi.submitReportQuery(payload);

            if (res?.query_id) {
                // Step 2: Poll for completion
                pollForDownload(res.query_id);
            } else {
                alert("Failed to initiate download.");
                setIsDownloading(false);
            }
        } catch (error) {
            console.error("Error initiating download", error);
            setIsDownloading(false);
        }
    };

    // Polling helper function
    const pollForDownload = async (queryId) => {
        let attempts = 0;
        const maxAttempts = 10; // Max 30 seconds (3s * 10)

        const interval = setInterval(async () => {
            try {
                attempts++;
                const statusRes = await pnbApi.getReportStatus(queryId);

                if (statusRes?.data?.status === 'READY' && statusRes.data.signed_url) {
                    clearInterval(interval);
                    setIsDownloading(false);
                    // Trigger download in new tab
                    window.open(statusRes.data.signed_url, '_blank');
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setIsDownloading(false);
                    alert("Download timed out. Please try again.");
                }
            } catch (err) {
                clearInterval(interval);
                setIsDownloading(false);
                alert("Failed to check download status.");
            }
        }, 3000); // Check every 3 seconds
    };

    // Local Search Filter Application
    const filteredData = tableData.filter(item =>
        (item.Transaction_Id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.Transaction_Amount || '').toString().includes(searchTerm)
    );

    return (
        <>
            {showProfileModal && (
                <ProfileModal merchantName={merchantName} activeVpa={activeVpaProfile} onClose={() => setShowProfileModal(false)} />
            )}

            <div style={{ display: 'flex', height: '100vh', background: '#f4f6f8', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>

                <Sidebar sidebarOpen={sidebarOpen} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} merchantName={merchantName} onViewProfile={() => setShowProfileModal(true)} />

                    <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111', marginBottom: 20 }}>Transaction Reports</h1>

                        {/* Filter Component */}
                        <ReportFilters
                            filterType={filterType}
                            setFilterType={setFilterType}
                            monthlyOption={monthlyOption}
                            setMonthlyOption={setMonthlyOption}
                            customDates={customDates}
                            setCustomDates={setCustomDates}
                            onSubmit={fetchReportData}
                        />

                        {/* Table Component */}
                        {isTableLoading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading transactions...</div>
                        ) : (
                            <ReportTable
                                data={filteredData}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onDownload={handleDownload}
                                isDownloading={isDownloading}
                            />
                        )}

                    </main>
                </div>
            </div>
        </>
    );
};

export default TransactionReports;