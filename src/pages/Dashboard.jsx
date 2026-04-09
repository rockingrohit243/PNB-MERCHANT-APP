import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { pnbApi } from '../services/pnbApi';
import { getMobileFromToken } from '../utils/authUtils';

// ── Icons ──────────────────────────────────────────────────────────────────────
import { IconSearch, IconTransfer, IconMail, IconChevronDown } from '../components/common/Icons';

// ── Modals & Layout ────────────────────────────────────────────────────────────
import SelectVpaModal from '../components/modals/SelectVpaModal';
import ProfileModal from '../components/modals/ProfileModal';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

// Helper: Formats JS Date to "DD/MM/YYYY" exactly as the new API requires
const toDDMMYYYY = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "";
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const Dashboard = () => {
  const [vpList, setVpList] = useState([]);
  const [merchantName, setMerchantName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMultiVpa, setIsMultiVpa] = useState(false);

  // VPA & Filters Selection
  const [showVpaModal, setShowVpaModal] = useState(false);
  const [selectedVpa, setSelectedVpa] = useState(null);
  const [activeVpaProfile, setActiveVpaProfile] = useState({});
  const [dateFilter, setDateFilter] = useState('Today');

  // Dropdown states
  const [vpaDropdownOpen, setVpaDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Modals & Navigation
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Stats Data
  const [stats, setStats] = useState({ totalTx: 0, totalAmount: 0 });

  const vpaDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  // 1. Initial Load: Fetch User Details by Mobile Number
  useEffect(() => {
    const activeMobileNumber = getMobileFromToken();

    const loadDashboard = async () => {
      try {
        const requestBody = { mobile_number: activeMobileNumber };
        const response = await pnbApi.fetchById(requestBody);

        if (response?.data?.length > 0) {
          const vpaData = response.data;
          setVpList(vpaData);
          setMerchantName(vpaData[0].merchant_name || 'Merchant User');
          
          // Step 1 of Logic: Set Default VPA
          setSelectedVpa(vpaData[0].vpa_id);
          setActiveVpaProfile(vpaData[0]);

          if (vpaData.length > 1) {
            setIsMultiVpa(true);
            setShowVpaModal(true); // Pop up if multiple
          } else {
            setIsMultiVpa(false);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  // 2. Fetch Profile details actively when a specific VPA is manually chosen
  const handleVpaSelect = async (vpaId) => {
    setSelectedVpa(vpaId);
    setShowVpaModal(false);
    
    try {
      const requestBody = { vpa_id: vpaId };
      const response = await pnbApi.fetchById(requestBody);

      if (response?.data?.length > 0) {
        setActiveVpaProfile(response.data[0]); 
      }
    } catch (error) {
      console.error(`Failed to fetch profile for VPA: ${vpaId}`, error);
    }
  };

  // 3. THE CORE LOGIC: Fetch Stats dynamically when VPA or Date changes
  useEffect(() => {
    const fetchDynamicStats = async () => {
      // Don't run until we have successfully set the default VPA
      if (!selectedVpa) return;

      try {
        const today = new Date();
        let targetDate = new Date(today);

        // Adjust date if user selected "Yesterday"
        if (dateFilter === 'Yesterday') {
          targetDate.setDate(today.getDate() - 1);
        }

        const dateString = toDDMMYYYY(targetDate);
        
        // Prepare payload exactly as the API doc dictates
        const payload = {
          startDate: dateString,
          endDate: dateString,
          vpa_id: selectedVpa,
          mode: "both"
        };

        const response = await pnbApi.submitReportQuery(payload);

        // Extract total count and amount from the "mode: both" response
        const totalTx = response?.row_count || 0;
        const totalAmount = response?.total_amount || 0;

        setStats({ totalTx, totalAmount });
      } catch (error) {
        console.error("Failed to load statistics for selected VPA/Date", error);
        setStats({ totalTx: 0, totalAmount: 0 }); 
      }
    };

    fetchDynamicStats();
  }, [selectedVpa, dateFilter]); // This hook runs ANY time VPA or Date changes!

  // Handle outside clicks for closing dropdowns cleanly
  useEffect(() => {
    const handler = (e) => {
      if (vpaDropdownRef.current && !vpaDropdownRef.current.contains(e.target)) setVpaDropdownOpen(false);
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) setDateDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Loading Screen Spinner
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
      {showVpaModal && isMultiVpa && (
        <SelectVpaModal
          vpList={vpList}
          initialSelected={selectedVpa}
          onSelect={handleVpaSelect}
          onCancel={() => setShowVpaModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          merchantName={merchantName}
          activeVpa={activeVpaProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      <div style={{ display: 'flex', height: '100vh', background: '#f4f6f8', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>
        <Sidebar sidebarOpen={sidebarOpen} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            merchantName={merchantName} 
            onViewProfile={() => setShowProfileModal(true)} 
          />

          <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111', marginBottom: 20 }}>Dashboard</h1>

            {/* VPA ID row + Date filter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              
              {/* VPA ID Selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#444', fontWeight: 500 }}>VPA ID :</span>

                {isMultiVpa ? (
                  <div ref={vpaDropdownRef} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setVpaDropdownOpen(v => !v)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #ddd', borderRadius: 6,
                        background: '#fff', padding: '6px 12px', fontSize: 13, color: '#222', cursor: 'pointer', fontWeight: 500,
                      }}
                    >
                      {selectedVpa}
                      <IconChevronDown />
                    </button>
                    {vpaDropdownOpen && (
                      <div style={{
                        position: 'absolute', top: 36, left: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 240, zIndex: 100,
                      }}>
                        {vpList.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => { handleVpaSelect(item.vpa_id); setVpaDropdownOpen(false); }}
                            style={{
                              width: '100%', padding: '10px 16px', border: 'none', background: selectedVpa === item.vpa_id ? '#fdf2f2' : 'none',
                              textAlign: 'left', fontSize: 13, color: selectedVpa === item.vpa_id ? '#a32a29' : '#222',
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
                  <span style={{ fontSize: 13, color: '#222', fontWeight: 500 }}>{selectedVpa}</span>
                )}
              </div>

              {/* Date filter Selection */}
              <div ref={dateDropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDateDropdownOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #ddd', borderRadius: 6,
                    background: '#fff', padding: '6px 14px', fontSize: 13, color: '#222', cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  {dateFilter}
                  <IconChevronDown />
                </button>
                {dateDropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 36, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 130, zIndex: 100,
                  }}>
                    {['Today', 'Yesterday'].map((opt) => (
                      <label
                        key={opt}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer',
                          fontSize: 13, background: dateFilter === opt ? '#fdf2f2' : 'none', color: '#222',
                        }}
                      >
                        <input
                          type="radio" name="dateFilter" value={opt} checked={dateFilter === opt}
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
              {/* Card 1: Total Transactions */}
              <div style={{
                background: '#fff', borderRadius: 10, padding: '20px 24px', border: '1px solid #efefef', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconTransfer />
                  </div>
                  <span style={{ fontSize: 14, color: '#444', fontWeight: 500 }}>Total No Of Transaction</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>
                  {stats.totalTx >= 1000 ? (stats.totalTx / 1000).toFixed(1) + 'K' : stats.totalTx}
                </span>
              </div>

              {/* Card 2: Total Amount */}
              <div style={{
                background: '#fff', borderRadius: 10, padding: '20px 24px', border: '1px solid #efefef', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconMail />
                  </div>
                  <span style={{ fontSize: 14, color: '#444', fontWeight: 500 }}>Total Amount</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>
                  ₹ {Number(stats.totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;