import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import pnbLogo from '../../assets/pnb-logo.png';
import { IconDashboard, IconReport, IconQR, IconLanguage, IconHelp } from '../common/Icons';

const navItems = [
    { label: 'Dashboard', icon: <IconDashboard />, path: '/' },
    { label: 'Transaction Reports', icon: <IconReport />, path: '/reports' },
    { label: 'QR Details', icon: <IconQR />, path: '/qr' },
    { label: 'Language Update', icon: <IconLanguage />, path: '/language' },
    { label: 'Help & Support', icon: <IconHelp />, path: '/help' },
];

const Sidebar = ({ sidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={{
            width: sidebarOpen ? 200 : 0, minWidth: sidebarOpen ? 200 : 0,
            background: '#fff', borderRight: '1px solid #e8e8e8',
            display: 'flex', flexDirection: 'column',
            transition: 'width 0.2s, min-width 0.2s', overflow: 'hidden', zIndex: 10,
        }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f0f0f0' }}>
                <img src={pnbLogo} alt="PNB" style={{ height: 40, objectFit: 'contain' }} />
            </div>
            <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                padding: '11px 20px', border: 'none', cursor: 'pointer',
                                background: isActive ? '#a32a29' : 'transparent',
                                color: isActive ? '#fff' : '#444',
                                fontSize: 13, fontWeight: isActive ? 600 : 400,
                                textAlign: 'left', transition: 'background 0.15s', whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#fdf2f2'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <span style={{ opacity: isActive ? 1 : 0.65 }}>{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;