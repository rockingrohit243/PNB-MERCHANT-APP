import React, { useState, useEffect } from 'react';
import { pnbApi } from '../services/pnbApi';
import { getMobileFromToken } from '../utils/authUtils';

// Layout & UI Components
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ProfileModal from '../components/modals/ProfileModal';
import Toast from '../components/common/Toast';
import QrCard from '../components/qr/QrCard';

const QrDetails = () => {
    // Layout States
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: 'error' });

    // Merchant Data States
    const [merchantProfile, setMerchantProfile] = useState(null);

    // QR Specific States
    const [qrType, setQrType] = useState('Static'); // 'Static' | 'Dynamic'
    const [amountInput, setAmountInput] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDynamicCard, setShowDynamicCard] = useState(false); // Only show Dynamic QR after generation

    // 1. Fetch Merchant Profile on Load
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const mobile = getMobileFromToken() || '7574857003';
                const response = await pnbApi.fetchById({ mobile_number: mobile });
                if (response?.data?.length > 0) {
                    setMerchantProfile(response.data[0]);
                }
            } catch (error) {
                showToast("Failed to load merchant profile.");
            }
        };
        fetchProfile();
    }, []);

    // 2. Auto-fetch Static QR when profile loads or tab switches back to Static
    useEffect(() => {
        if (merchantProfile && qrType === 'Static') {
            fetchQrCode(merchantProfile.qr_string);
            setShowDynamicCard(false); // Reset dynamic state
            setAmountInput('');
        }
        // eslint-disable-next-line
    }, [merchantProfile, qrType]);

    // Helper to show Toast
    const showToast = (message, type = 'error') => {
        setToastConfig({ show: true, message, type });
    };

    // 3. Centralized QR Generation Logic
    const fetchQrCode = async (rawQrString) => {
        if (!rawQrString) {
            showToast("Merchant QR string not found.");
            return;
        }
        setIsGenerating(true);
        setBase64Image(''); // Clear previous image

        try {
            const response = await pnbApi.convertToQRBase64(rawQrString);
            if (response && response.base64Image) {
                setBase64Image(response.base64Image);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            // Safely extract error message matching API doc structure
            let errorMsg = "Failed to generate QR code.";
            if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
                errorMsg = error.response.data.error[0].msg; // E.g., "qrString is required"
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            showToast(errorMsg);
        } finally {
            setIsGenerating(false);
        }
    };

    // 4. Handle Dynamic QR Generation click
    const handleGenerateDynamic = () => {
        if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
            showToast("Please enter a valid amount.");
            return;
        }
        if (!merchantProfile?.qr_string) {
            showToast("Merchant QR string is missing.");
            return;
        }

        // Append standard UPI amount parameter (&am=) to the raw QR string
        const dynamicQrString = `${merchantProfile.qr_string}&am=${amountInput}`;
        fetchQrCode(dynamicQrString);
        setShowDynamicCard(true);
    };

    return (
        <>
            {toastConfig.show && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    onClose={() => setToastConfig({ ...toastConfig, show: false })}
                />
            )}

            {showProfileModal && (
                <ProfileModal
                    merchantName={merchantProfile?.merchant_name || 'Merchant User'}
                    activeVpa={merchantProfile}
                    onClose={() => setShowProfileModal(false)}
                />
            )}

            <div style={{ display: 'flex', height: '100vh', background: '#f4f6f8', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>

                <Sidebar sidebarOpen={sidebarOpen} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    <Topbar
                        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                        merchantName={merchantProfile?.merchant_name || 'Merchant User'}
                        onViewProfile={() => setShowProfileModal(true)}
                    />

                    <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111', marginBottom: 20 }}>QR Details</h1>

                        {/* Top Control Panel */}
                        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', padding: '24px', marginBottom: 24 }}>
                            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Select The Type of QR</p>

                            {/* Radio Group */}
                            <div style={{ display: 'flex', gap: 24, marginBottom: qrType === 'Dynamic' ? 24 : 0 }}>
                                {['Static', 'Dynamic'].map((type) => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#111' }}>
                                        <input
                                            type="radio" name="qrType" value={type}
                                            checked={qrType === type}
                                            onChange={() => setQrType(type)}
                                            style={{ accentColor: '#a32a29', width: 16, height: 16 }}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>

                            {/* Dynamic QR Input Field */}
                            {qrType === 'Dynamic' && (
                                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
                                    <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Enter an amount to instantly generate your dynamic QR code</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <label style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>Amount to be collected</label>
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <input
                                                type="text"
                                                placeholder="Enter the amount to be collected"
                                                value={amountInput}
                                                onChange={(e) => setAmountInput(e.target.value.replace(/[^0-9.]/g, ''))}
                                                style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, width: 300, fontSize: 13, outline: 'none' }}
                                            />
                                            <button
                                                onClick={handleGenerateDynamic}
                                                disabled={isGenerating}
                                                style={{
                                                    background: '#a32a29', color: '#fff', border: 'none', borderRadius: 6,
                                                    padding: '0 24px', fontSize: 13, fontWeight: 500, cursor: isGenerating ? 'not-allowed' : 'pointer',
                                                    opacity: isGenerating ? 0.7 : 1
                                                }}
                                            >
                                                {isGenerating ? 'Generating...' : 'Generate QR'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* QR Card Presentation */}
                        {merchantProfile && (qrType === 'Static' || (qrType === 'Dynamic' && showDynamicCard)) && (
                            <div style={{ paddingBottom: '40px' }}>
                                <QrCard
                                    base64Image={base64Image}
                                    merchantName={merchantProfile.merchant_name}
                                    vpaId={merchantProfile.vpa_id}
                                    isDynamic={qrType === 'Dynamic'}
                                    amount={amountInput}
                                />
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
};

export default QrDetails;