import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { pnbApi } from '../services/pnbApi';
import { authService } from '../services/authService';
import pnbLogo from '../assets/pnb-logo.png';

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IconReport = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconQR = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/>
    <rect x="3" y="16" width="5" height="5"/>
    <line x1="21" y1="16" x2="21" y2="21"/><line x1="16" y1="21" x2="21" y2="21"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
    <line x1="11" y1="3" x2="11" y2="8"/><line x1="8" y1="11" x2="3" y2="11"/>
    <line x1="11" y1="13" x2="11" y2="21"/><line x1="13" y1="11" x2="21" y2="11"/>
    <line x1="13" y1="3" x2="13" y2="8"/>
  </svg>
);
const IconLanguage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconHelp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconTransfer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a32a29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a32a29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconHamburger = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Profile Avatar ─────────────────────────────────────────────────────────────
const Avatar = ({ name }) => (
  <div style={{
    width: 32, height: 32, borderRadius: '50%',
    background: '#e8c4a0', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#7a4a1e', flexShrink: 0,
    border: '2px solid #d4a574'
  }}>
    {name?.charAt(0)?.toUpperCase() || 'M'}
  </div>
);

// ── Select VPA Modal (Multi VPA) ───────────────────────────────────────────────
const SelectVpaModal = ({ vpList, onSelect, onCancel }) => {
  const [selected, setSelected] = useState(vpList[0]?.vpa_id || '');
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {vpList.map((item, i) => (
            <label key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 0', cursor: 'pointer',
              borderBottom: i < vpList.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <input
                type="radio" name="vpa" value={item.vpa_id}
                checked={selected === item.vpa_id}
                onChange={() => setSelected(item.vpa_id)}
                style={{ accentColor: '#a32a29', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, color: '#222' }}>{item.vpa_id}</span>
            </label>
          ))}
        </div>

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

// ── Profile Details Modal ──────────────────────────────────────────────────────
const ProfileModal = ({ merchantName, vpList, onClose }) => {
  const vpa = vpList[0] || {};
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, width: 480,
        boxShadow: '0 8px 32px rgba(0,0,0,0.16)', overflow: 'hidden'
      }}>
        <div style={{ padding: '24px 28px 0' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#111', marginBottom: 20 }}>View Profile Details</h2>

          {/* Basic Info */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 14 }}>Basic Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 14 }}>
              <InfoRow label="Name" value={merchantName} />
              <InfoRow label="Phone" value={vpa.merchant_mobile || '+91 9398239231'} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 14 }}>Device Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 14 }}>
              <InfoRow label="Device Serial Number" value={vpa.device_serial || '456954659876857'} />
              <InfoRow label="Linked Account Number" value={`XXXXX${vpa.merchant_account_no?.slice(-4) || '6857'}`} />
              <InfoRow label="UPI ID" value={vpa.vpa_id || 'rudransh.panigrahi@pnb'} />
              <InfoRow label="IFSC Code" value={vpa.ifsc || 'PUNB028386'} />
              <InfoRow label="Device Model Name" value={vpa.device_model || 'Morefun ET389'} />
              <InfoRow label="Device Mobile Number" value={vpa.device_mobile || '+91 9398239231'} />
              <InfoRow label="Network Type" value={vpa.network_type || 'BSNL'} />
              <InfoRow label="Device Status" value={vpa.device_status || 'Active'} />
              <InfoRow label="Battery Percentage" value={vpa.battery || '60%'} />
              <InfoRow label="Network Strength" value={vpa.network_strength || 'Strong'} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 28px 20px' }}>
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

const InfoRow = ({ label, value }) => (
  <div>
    <p style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{label}</p>
    <p style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{value}</p>
  </div>
);

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [vpList, setVpList] = useState([]);
  const [merchantName, setMerchantName] = useState('Stebin Ben');
  const [isLoading, setIsLoading] = useState(true);
  const [isMultiVpa, setIsMultiVpa] = useState(false);

  // Multi-VPA modal (shown at start if multi)
  const [showVpaModal, setShowVpaModal] = useState(false);
  // Selected VPA (single or chosen from multi)
  const [selectedVpa, setSelectedVpa] = useState(null);

  // VPA dropdown (multi-vpa header dropdown)
  const [vpaDropdownOpen, setVpaDropdownOpen] = useState(false);

  // Date filter dropdown
  const [dateFilter, setDateFilter] = useState('Today');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // User menu dropdown
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Sidebar collapse
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Stats (mocked — wire to API as needed)
  const [stats] = useState({ totalTx: '20.7K', totalAmount: '76,000 cr' });

  const navigate = useNavigate();
  const location = useLocation();

  const vpaDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const merchantIdentifier = '7574857003';
    const loadDashboard = async () => {
      try {
        const response = await pnbApi.fetchById(merchantIdentifier);
        if (response && response.length > 0) {
          setVpList(response);
          setMerchantName(response[0].merchant_name || 'Stebin Ben');
          if (response.length > 1) {
            setIsMultiVpa(true);
            setShowVpaModal(true);
            setSelectedVpa(response[0].vpa_id);
          } else {
            setIsMultiVpa(false);
            setSelectedVpa(response[0].vpa_id);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        // Demo fallback
        const demo = [
          { vpa_id: 'Pabitra.hota@pnb', merchant_name: 'Stebin Ben', merchant_account_no: '123456857' },
          { vpa_id: '9283032322742bis@pnb', merchant_name: 'Stebin Ben', merchant_account_no: '123456857' },
          { vpa_id: 'Pabitra@pnb', merchant_name: 'Stebin Ben', merchant_account_no: '123456857' },
          { vpa_id: 'Pabitra.hota@pnb', merchant_name: 'Stebin Ben', merchant_account_no: '123456857' },
        ];
        setVpList(demo);
        setMerchantName('Stebin Ben');
        setIsMultiVpa(true);
        setShowVpaModal(true);
        setSelectedVpa(demo[0].vpa_id);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (vpaDropdownRef.current && !vpaDropdownRef.current.contains(e.target)) setVpaDropdownOpen(false);
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) setDateDropdownOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleVpaSelect = (vpaId) => {
    setSelectedVpa(vpaId);
    setShowVpaModal(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: <IconDashboard />, path: '/' },
    { label: 'Transaction Reports', icon: <IconReport />, path: '/reports' },
    { label: 'QR Details', icon: <IconQR />, path: '/qr' },
    { label: 'Language Update', icon: <IconLanguage />, path: '/language' },
    { label: 'Help & Support', icon: <IconHelp />, path: '/help' },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f6f8' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid #f0f0f0', borderTopColor: '#a32a29',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {/* Multi-VPA selection modal */}
      {showVpaModal && isMultiVpa && (
        <SelectVpaModal
          vpList={vpList}
          onSelect={handleVpaSelect}
          onCancel={() => setShowVpaModal(false)}
        />
      )}

      {/* Profile modal */}
      {showProfileModal && (
        <ProfileModal
          merchantName={merchantName}
          vpList={vpList}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      <div style={{ display: 'flex', height: '100vh', background: '#f4f6f8', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: sidebarOpen ? 200 : 0,
          minWidth: sidebarOpen ? 200 : 0,
          background: '#fff',
          borderRight: '1px solid #e8e8e8',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s, min-width 0.2s',
          overflow: 'hidden',
          zIndex: 10,
        }}>
          {/* Logo */}
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f0f0f0' }}>
            <img src={pnbLogo} alt="PNB" style={{ height: 40, objectFit: 'contain' }} />
          </div>

          {/* Nav */}
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
                    textAlign: 'left', transition: 'background 0.15s',
                    whiteSpace: 'nowrap',
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

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ── TOPBAR ── */}
          <header style={{
            height: 60, background: '#fff', borderBottom: '1px solid #e8e8e8',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', flexShrink: 0,
          }}>
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 4 }}
            >
              <IconHamburger />
            </button>

            {/* User menu */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4
                }}
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
                    onClick={() => { setShowProfileModal(true); setUserMenuOpen(false); }}
                    style={{
                      width: '100%', padding: '11px 18px', border: 'none',
                      background: 'none', textAlign: 'left', fontSize: 13,
                      color: '#222', cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', padding: '11px 18px', border: 'none',
                      background: 'none', textAlign: 'left', fontSize: 13,
                      color: '#a32a29', cursor: 'pointer', fontWeight: 500,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fdf2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* ── CONTENT ── */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111', marginBottom: 20 }}>Dashboard</h1>

            {/* VPA ID row + Date filter */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              {/* VPA ID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#444', fontWeight: 500 }}>VPA ID :</span>

                {isMultiVpa ? (
                  /* Dropdown for multi-VPA */
                  <div ref={vpaDropdownRef} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setVpaDropdownOpen(v => !v)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        border: '1px solid #ddd', borderRadius: 6,
                        background: '#fff', padding: '6px 12px',
                        fontSize: 13, color: '#222', cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {selectedVpa}
                      <IconChevronDown />
                    </button>
                    {vpaDropdownOpen && (
                      <div style={{
                        position: 'absolute', top: 36, left: 0, background: '#fff',
                        border: '1px solid #e8e8e8', borderRadius: 6,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 240, zIndex: 100,
                      }}>
                        {vpList.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => { setSelectedVpa(item.vpa_id); setVpaDropdownOpen(false); }}
                            style={{
                              width: '100%', padding: '10px 16px', border: 'none',
                              background: selectedVpa === item.vpa_id ? '#fdf2f2' : 'none',
                              textAlign: 'left', fontSize: 13,
                              color: selectedVpa === item.vpa_id ? '#a32a29' : '#222',
                              cursor: 'pointer', fontWeight: selectedVpa === item.vpa_id ? 600 : 400,
                            }}
                            onMouseEnter={e => { if (selectedVpa !== item.vpa_id) e.currentTarget.style.background = '#f9f9f9'; }}
                            onMouseLeave={e => { if (selectedVpa !== item.vpa_id) e.currentTarget.style.background = 'none'; }}
                          >
                            {item.vpa_id}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Static text for single VPA */
                  <span style={{ fontSize: 13, color: '#222', fontWeight: 500 }}>{selectedVpa}</span>
                )}
              </div>

              {/* Date filter */}
              <div ref={dateDropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDateDropdownOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    border: '1px solid #ddd', borderRadius: 6,
                    background: '#fff', padding: '6px 14px',
                    fontSize: 13, color: '#222', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  {dateFilter}
                  <IconChevronDown />
                </button>
                {dateDropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 36, background: '#fff',
                    border: '1px solid #e8e8e8', borderRadius: 6,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 130, zIndex: 100,
                  }}>
                    {['Today', 'Yesterday'].map((opt) => (
                      <label
                        key={opt}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', cursor: 'pointer',
                          fontSize: 13,
                          background: dateFilter === opt ? '#fdf2f2' : 'none',
                          color: '#222',
                        }}
                      >
                        <input
                          type="radio" name="dateFilter" value={opt}
                          checked={dateFilter === opt}
                          onChange={() => { setDateFilter(opt); setDateDropdownOpen(false); }}
                          style={{ accentColor: '#a32a29' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Card 1 */}
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
                    <IconTransfer />
                  </div>
                  <span style={{ fontSize: 14, color: '#444', fontWeight: 500 }}>Total No Of Transaction</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{stats.totalTx}</span>
              </div>

              {/* Card 2 */}
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
                    <IconMail />
                  </div>
                  <span style={{ fontSize: 14, color: '#444', fontWeight: 500 }}>Total Amount</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{stats.totalAmount}</span>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
