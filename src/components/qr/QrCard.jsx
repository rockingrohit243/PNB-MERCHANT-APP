import React, { useState, useEffect } from 'react';
import pnbLogo from '../../assets/pnb-logo.png';

const QrCard = ({ base64Image, merchantName, vpaId, amount, isDynamic }) => {
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for dynamic QR

    // Simple countdown timer for Dynamic QR
    useEffect(() => {
        if (!isDynamic || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [isDynamic, timeLeft]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64Image}`;
        link.download = `${merchantName.replace(/\s+/g, '_')}_QRCode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div style={{
            width: '380px', margin: '0 auto', background: '#fff',
            border: '1px solid #f0f0f0', borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '32px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>

            {/* Conditional Amount Header for Dynamic QR */}
            {isDynamic && amount && (
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>Amount to be Collected</p>
                    <p style={{ fontSize: 24, color: '#a32a29', fontWeight: 700 }}>₹ {amount}</p>
                </div>
            )}

            {/* PNB Logo & Top VPA */}
            <img src={pnbLogo} alt="PNB" style={{ height: 40, marginBottom: 8 }} />
            <p style={{ fontSize: 11, color: '#666', marginBottom: 24, letterSpacing: '0.5px' }}>
                UPI ID : {vpaId}
            </p>

            {/* Merchant Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#888"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#333', textTransform: 'uppercase' }}>
                    {merchantName}
                </span>
            </div>

            {/* Actual QR Image */}
            <div style={{ width: '220px', height: '220px', marginBottom: 16 }}>
                {base64Image ? (
                    <img src={`data:image/png;base64,${base64Image}`} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 12, color: '#aaa' }}>Loading QR...</span>
                    </div>
                )}
            </div>

            <p style={{ fontSize: 12, color: '#444', marginBottom: 24 }}>
                UPI ID : {vpaId}
            </p>

            {/* Conditional Timer for Dynamic QR */}
            {isDynamic && (
                <p style={{ fontSize: 13, color: '#a32a29', fontWeight: 500, marginBottom: 16 }}>
                    Valid till {formatTime(timeLeft)}
                </p>
            )}

            {/* Download Button */}
            <button onClick={handleDownload} disabled={!base64Image} style={{
                background: '#a32a29', color: '#fff', border: 'none', borderRadius: 6,
                padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: base64Image ? 'pointer' : 'not-allowed',
                marginBottom: 24, opacity: base64Image ? 1 : 0.6
            }}>
                Download QR Code
            </button>

            {/* Powered By UPI (Mock Text representation) */}
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>POWERED BY</p>
                <h3 style={{ fontSize: 18, margin: 0, color: '#555', fontStyle: 'italic', fontWeight: 800 }}>UPI<span style={{ color: '#f26522' }}>►</span></h3>
                <p style={{ fontSize: 7, color: '#aaa', margin: 0 }}>UNIFIED PAYMENTS INTERFACE</p>
            </div>
        </div>
    );
};

export default QrCard;