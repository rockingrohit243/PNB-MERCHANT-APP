import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { IconHamburger } from '../common/Icons';
import { authService } from '../../services/authService';

const Topbar = ({ toggleSidebar, merchantName, onViewProfile }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header style={{
            height: 60, background: '#fff', borderBottom: '1px solid #e8e8e8',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', flexShrink: 0,
        }}>
            <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 4 }}>
                <IconHamburger />
            </button>

            <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                    <Avatar name={merchantName} />
                    <span style={{ fontSize: 14, color: '#222', fontWeight: 500 }}>{merchantName}</span>
                </button>

                {userMenuOpen && (
                    <div style={{
                        position: 'absolute', right: 0, top: 40, background: '#fff',
                        border: '1px solid #e8e8e8', borderRadius: 6,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 150, zIndex: 100,
                    }}>
                        <button
                            onClick={() => { onViewProfile(); setUserMenuOpen(false); }}
                            style={{ width: '100%', padding: '11px 18px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13, color: '#222', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            View Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{ width: '100%', padding: '11px 18px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13, color: '#a32a29', cursor: 'pointer', fontWeight: 500 }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fdf2f2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;