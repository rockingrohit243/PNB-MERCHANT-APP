import React from 'react';

const StatCard = ({ title, value, icon }) => (
    <div style={{
        background: '#fff', borderRadius: 10, padding: '20px 24px',
        border: '1px solid #efefef', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {icon}
            </div>
            <span style={{ fontSize: 14, color: '#444', fontWeight: 500 }}>{title}</span>
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>
            {value}
        </span>
    </div>
);

export default StatCard;