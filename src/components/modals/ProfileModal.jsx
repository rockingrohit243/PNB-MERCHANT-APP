import React from 'react';

// Helper component just for formatting the text pairs in the profile
const InfoRow = ({ label, value }) => (
    <div>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{value}</p>
    </div>
);

const ProfileModal = ({ merchantName, activeVpa, onClose }) => {
    // Default to an empty object if activeVpa is undefined to prevent errors
    const vpa = activeVpa || {};

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#fff', borderRadius: 8, width: 480,
                boxShadow: '0 8px 32px rgba(0,0,0,0.16)', overflow: 'hidden'
            }}>
                {/* Modal Header & Content */}
                <div style={{ padding: '24px 28px 0', maxHeight: '70vh', overflowY: 'auto' }}>
                    <h2 style={{ fontSize: 17, fontWeight: 600, color: '#111', marginBottom: 20 }}>View Profile Details</h2>

                    {/* Section 1: Basic Information */}
                    <div style={{ marginBottom: 24 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 14 }}>Basic Information</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 14 }}>
                            <InfoRow label="Name" value={merchantName} />
                            <InfoRow label="Phone" value={vpa.merchant_mobile || 'N/A'} />
                        </div>
                    </div>

                    {/* Section 2: Device & Account Information */}
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, marginBottom: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 14 }}>Device Information</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 14 }}>
                            <InfoRow label="Device Serial Number" value={vpa.serial_number || vpa.device_serial || 'N/A'} />
                            <InfoRow label="Linked Account Number" value={vpa.merchant_account_no ? `XXXXX${vpa.merchant_account_no.slice(-4)}` : 'N/A'} />
                            <InfoRow label="UPI ID" value={vpa.vpa_id || 'N/A'} />
                            <InfoRow label="IFSC Code" value={vpa.ifsc || 'N/A'} />
                            <InfoRow label="Device Model Name" value={vpa.device_model || 'N/A'} />
                            <InfoRow label="Device Mobile Number" value={vpa.merchant_mobile || 'N/A'} />
                            <InfoRow label="Network Type" value={vpa.network_type || 'N/A'} />
                            <InfoRow label="Device Status" value={vpa.device_status || 'N/A'} />
                            <InfoRow label="Battery Percentage" value={vpa.battery || 'N/A'} />
                            <InfoRow label="Network Strength" value={vpa.network_strength || 'N/A'} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 28px 20px', borderTop: '1px solid #f0f0f0' }}>
                    <button onClick={onClose} style={{
                        background: '#a32a29', color: '#fff', border: 'none',
                        borderRadius: 6, padding: '9px 28px', fontSize: 14,
                        fontWeight: 600, cursor: 'pointer'
                    }}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;