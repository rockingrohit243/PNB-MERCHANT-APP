import React, { useEffect, useState, useRef } from 'react';
import { pnbApi } from '../services/pnbApi';
import { getMobileFromToken } from '../utils/authUtils';

import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import StatCard from '../components/dashboard/StatCard';
import SelectVpaModal from '../components/modals/SelectVpaModal';
import ProfileModal from '../components/modals/ProfileModal';
import { IconChevronDown, IconTransfer, IconMail } from '../components/common/Icons';


const Dashboard = () => {
  const [vpList, setVpList] = useState([]);
  const [merchantName, setMerchantName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMultiVpa, setIsMultiVpa] = useState(false);

  const [showVpaModal, setShowVpaModal] = useState(false);
  const [selectedVpa, setSelectedVpa] = useState(null);
  const [activeVpaProfile, setActiveVpaProfile] = useState({});
  const [dateFilter, setDateFilter] = useState('Today');

  const [vpaDropdownOpen, setVpaDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [stats, setStats] = useState({ totalTx: 0, totalAmount: 0 });

  const vpaDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  // Initial Load
  useEffect(() => {
    const activeMobileNumber = getMobileFromToken() || '7574857003';

    const loadDashboard = async () => {
      try {
        const requestBody = { mobile_number: activeMobileNumber };
        const response = await pnbApi.fetchById(requestBody);

        if (response?.data?.length > 0) {
          const vpaData = response.data;
          setVpList(vpaData);
          setMerchantName(vpaData[0].merchant_name || 'Merchant User');
          setSelectedVpa(vpaData[0].vpa_id);
          setActiveVpaProfile(vpaData[0]);

          if (vpaData.length > 1) {
            setIsMultiVpa(true);
            setShowVpaModal(true);
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

  // Fetch VPA Profile
  const handleVpaSelect = async (vpaId) => {
    setSelectedVpa(vpaId);
    setShowVpaModal(false);

    try {
      const response = await pnbApi.fetchById({ vpa_id: vpaId });
      if (response?.data?.length > 0) {
        setActiveVpaProfile(response.data[0]);
      }
    } catch (error) {
      console.error(`Failed to fetch profile for VPA: ${vpaId}`, error);
    }
  };

  // Fetch Stats dynamically
  useEffect(() => {
    const fetchDynamicStats = async () => {
      if (!selectedVpa) return;

      try {
        const today = new Date();
        let start = new Date(today);
        let end = new Date(today);

        if (dateFilter === 'Yesterday') {
          start.setDate(today.getDate() - 1);
          end = new Date(start);
        }

        const formatDate = (date) => date.toISOString().split('T')[0];
        const reportData = await pnbApi.fetchReports(formatDate(start), formatDate(end));
        const txns = Array.isArray(reportData) ? reportData : (reportData?.data || []);

        const filteredTxns = txns.filter(txn => txn.vpa_id === selectedVpa);
        setStats({
          totalTx: filteredTxns.length,
          totalAmount: filteredTxns.reduce((sum, txn) => sum + (Number(txn.amount) || 0), 0)
        });
      } catch (error) {
        console.error("Failed to load statistics", error);
        setStats({ totalTx: 0, totalAmount: 0 });
      }
    };
    fetchDynamicStats();
  }, [selectedVpa, dateFilter]);

  // Handle outside clicks
  useEffect(() => {
    const handler = (e) => {
      if (vpaDropdownRef.current && !vpaDropdownRef.current.contains(e.target)) setVpaDropdownOpen(false);
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) setDateDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f6f8' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #f0f0f0', borderTopColor: '#a32a29', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {showVpaModal && isMultiVpa && (
        <SelectVpaModal vpList={vpList} initialSelected={selectedVpa} onSelect={handleVpaSelect} onCancel={() => setShowVpaModal(false)} />
      )}

      {showProfileModal && (
        <ProfileModal merchantName={merchantName} activeVpa={activeVpaProfile} onClose={() => setShowProfileModal(false)} />
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

            {/* Filters Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>

              {/* VPA Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#444', fontWeight: 500 }}>VPA ID :</span>
                {isMultiVpa ? (
                  <div ref={vpaDropdownRef} style={{ position: 'relative' }}>
                    <button onClick={() => setVpaDropdownOpen(!vpaDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #ddd', borderRadius: 6, background: '#fff', padding: '6px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                      {selectedVpa} <IconChevronDown />
                    </button>
                    {vpaDropdownOpen && (
                      <div style={{ position: 'absolute', top: 36, left: 0, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 240, zIndex: 100 }}>
                        {vpList.map((item, i) => (
                          <button key={i} onClick={() => { handleVpaSelect(item.vpa_id); setVpaDropdownOpen(false); }} style={{ width: '100%', padding: '10px 16px', border: 'none', background: selectedVpa === item.vpa_id ? '#fdf2f2' : 'none', textAlign: 'left', fontSize: 13, color: selectedVpa === item.vpa_id ? '#a32a29' : '#222', cursor: 'pointer', fontWeight: selectedVpa === item.vpa_id ? 600 : 400 }}>
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

              {/* Date Selector */}
              <div ref={dateDropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setDateDropdownOpen(!dateDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #ddd', borderRadius: 6, background: '#fff', padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                  {dateFilter} <IconChevronDown />
                </button>
                {dateDropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: 36, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 130, zIndex: 100 }}>
                    {['Today', 'Yesterday'].map((opt) => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 13, background: dateFilter === opt ? '#fdf2f2' : 'none', color: '#222' }}>
                        <input type="radio" name="dateFilter" value={opt} checked={dateFilter === opt} onChange={() => { setDateFilter(opt); setDateDropdownOpen(false); }} style={{ accentColor: '#a32a29' }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <StatCard
                title="Total No Of Transaction"
                value={stats.totalTx >= 1000 ? (stats.totalTx / 1000).toFixed(1) + 'K' : stats.totalTx}
                icon={<IconTransfer />}
              />
              <StatCard
                title="Total Amount"
                value={`₹ ${stats.totalAmount.toLocaleString()}`}
                icon={<IconMail />}
              />
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;