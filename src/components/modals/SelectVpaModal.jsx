import React, { useState } from 'react';

const SelectVpaModal = ({ vpList, initialSelected, onSelect, onCancel }) => {
    // Local state to track which radio button is currently selected before clicking 'Proceed'
    const [selected, setSelected] = useState(initialSelected || vpList[0]?.vpa_id || '');

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#fff', borderRadius: 8, width: 420, padding: '32px 28px 24px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
            }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111', marginBottom: 6 }}>Select VPA</h2>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>Select a VPA to Proceed</p>

                {/* Scrollable list of VPAs if there are many */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: '300px', overflowY: 'auto' }}>
                    {vpList.map((item, i) => (
                        <label key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '14px 0', cursor: 'pointer',
                            borderBottom: i < vpList.length - 1 ? '1px solid #f0f0f0' : 'none'
                        }}>
                            <input
                                type="radio"
                                name="vpa"
                                value={item.vpa_id}
                                checked={selected === item.vpa_id}
                                onChange={() => setSelected(item.vpa_id)}
                                style={{ accentColor: '#a32a29', width: 16, height: 16 }}
                            />
                            <span style={{ fontSize: 14, color: '#222' }}>{item.vpa_id}</span>
                        </label>
                    ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                    <button onClick={onCancel} style={{
                        background: 'none', border: 'none', color: '#555', fontSize: 14,
                        cursor: 'pointer', padding: '8px 16px', fontWeight: 500
                    }}>Cancel</button>

                    <button onClick={() => onSelect(selected)} style={{
                        background: '#a32a29', color: '#fff', border: 'none',
                        borderRadius: 6, padding: '9px 24px', fontSize: 14,
                        fontWeight: 600, cursor: 'pointer'
                    }}>Proceed</button>
                </div>
            </div>
        </div>
    );
};

export default SelectVpaModal;