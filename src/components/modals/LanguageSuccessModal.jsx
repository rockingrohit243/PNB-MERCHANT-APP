import React from 'react';

const LanguageSuccessModal = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050
        }}>
            <div style={{
                background: '#fff', borderRadius: 8, width: 380, padding: '32px 32px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)', textAlign: 'center'
            }}>
                <h2 style={{ fontSize: 15, fontWeight: 500, color: '#111', marginBottom: 24, lineHeight: 1.4 }}>
                    Language update request<br />Initiated Successfully
                </h2>

                {/* Big Green Checkmark Icon */}
                <div style={{
                    width: 86, height: 86, borderRadius: '50%', background: '#e6f9ed',
                    border: '4px solid #c2f0d5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 32px'
                }}>
                    <div style={{
                        width: 62, height: 62, borderRadius: '50%', background: '#22c55e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                {/* Action Button */}
                <button onClick={onClose} style={{
                    width: '100%', background: '#a32a29', color: '#fff', border: 'none',
                    borderRadius: 6, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default LanguageSuccessModal;