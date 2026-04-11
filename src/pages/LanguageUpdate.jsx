import React, { useState, useEffect } from 'react';
import { pnbApi } from '../services/pnbApi';
import { getMobileFromToken } from '../utils/authUtils';

import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ProfileModal from '../components/modals/ProfileModal';
import LanguageSuccessModal from '../components/modals/LanguageSuccessModal';
import Toast from '../components/common/Toast';

const LanguageUpdate = () => {
  // Layout States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: 'error' });
  
  // Data States
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('Loading...');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  // Loading State
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper to show Toast
  const showToast = (message, type = 'error') => {
    setToastConfig({ show: true, message, type });
  };

  // 1. Initial Load: Fetch Profile & Languages INDEPENDENTLY
  useEffect(() => {
    
    // Fetch Merchant Profile
    const fetchProfile = async () => {
      try {
        const mobile = getMobileFromToken() || '7574857003';
        const profileRes = await pnbApi.fetchById({ mobile_number: mobile });
        if (profileRes?.data?.length > 0) {
          setMerchantProfile(profileRes.data[0]);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    // Fetch Available Languages List
    const fetchLangs = async () => {
      try {
        const langRes = await pnbApi.fetchAllLanguages();
        
        // Safely handle different array structures from the backend
        const langsList = Array.isArray(langRes?.data) ? langRes.data : (Array.isArray(langRes) ? langRes : []);
        setAvailableLanguages(langsList);
      } catch (error) {
        console.error("Languages fetch error:", error);
      }
    };

    fetchProfile();
    fetchLangs();
  }, []);

  // 2. Fetch Current Language ONCE the TID is available
  const fetchCurrentLanguage = async (tid) => {
    setCurrentLanguage('Loading...');
    try {
      const res = await pnbApi.getCurrentLanguage(tid);
      
      if (res?.data) {
        setCurrentLanguage(res.data);
      } else {
        setCurrentLanguage('Not Available');
      }
    } catch (error) {
      console.error("Could not fetch current language:", error);
      setCurrentLanguage('Not Available');
    }
  };

  // Listen for when merchantProfile populates, then get the Current Language
  useEffect(() => {
    const tid = merchantProfile?.serial_number || merchantProfile?.device_serial;
    if (tid) {
      fetchCurrentLanguage(tid);
    } else if (merchantProfile) {
      setCurrentLanguage('No Device TID');
    }
  }, [merchantProfile]);

  // 3. Handle Update Button Click
  const handleUpdate = async () => {
    if (!selectedLanguage) {
      showToast("Please select a language to update.");
      return;
    }

    const tid = merchantProfile?.serial_number || merchantProfile?.device_serial;
    if (!tid) {
      showToast("Device Serial Number (TID) is missing.");
      return;
    }

    setIsUpdating(true);

    try {
      const res = await pnbApi.updateLanguage(tid, selectedLanguage);
      
      // Based on API doc, "01" is initiated, "00" is successful update
      if (res?.responseCode === "00" || res?.responseCode === "01") {
        setShowSuccessModal(true);
        // Automatically refresh current language immediately
        fetchCurrentLanguage(tid);
      } else {
        // Handle "02" errors (e.g. "language already updated" or "request in progress")
        showToast(res?.statusDesc || res?.message || "Failed to update language.");
      }
    } catch (error) {
      let errorMsg = "Language update failed.";
      if (error.response?.data?.statusDesc) {
        errorMsg = error.response.data.statusDesc;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      showToast(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setSelectedLanguage(''); // Reset dropdown
  };

  return (
    <>
      {toastConfig.show && <Toast message={toastConfig.message} type={toastConfig.type} onClose={() => setToastConfig({ ...toastConfig, show: false })} />}
      {showProfileModal && <ProfileModal merchantName={merchantProfile?.merchant_name} activeVpa={merchantProfile} onClose={() => setShowProfileModal(false)} />}
      {showSuccessModal && <LanguageSuccessModal onClose={handleCloseSuccess} />}

      <div style={{ display: 'flex', height: '100vh', background: '#f4f6f8', fontFamily: "'Segoe UI', sans-serif", overflow: 'hidden' }}>
        <Sidebar sidebarOpen={sidebarOpen} />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} merchantName={merchantProfile?.merchant_name} onViewProfile={() => setShowProfileModal(true)} />

          <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111', marginBottom: 20 }}>Language Update</h1>

            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0', padding: '24px' }}>
              
              {/* Top Row: VPA ID & Serial Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8 }}>VPA ID</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={merchantProfile?.vpa_id || ''} 
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 13, background: '#fafafa', color: '#555', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8 }}>Device Serial Number</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={merchantProfile?.serial_number || merchantProfile?.device_serial || ''} 
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 13, background: '#fafafa', color: '#555', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Bottom Row: Current Language & Dropdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8 }}>Current Language</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={currentLanguage} 
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8e8e8', borderRadius: 6, fontSize: 13, background: '#fafafa', color: '#555', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 8 }}>Language Update</label>
                  <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, color: '#111', background: '#fff', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select Language Update</option>
                    {availableLanguages.map((lang, idx) => (
                      <option key={idx} value={lang}>{lang.charAt(0) + lang.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button 
                  onClick={() => setSelectedLanguage('')} 
                  style={{ background: 'none', border: 'none', color: '#a32a29', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={isUpdating || availableLanguages.length === 0}
                  style={{ 
                    background: '#a32a29', color: '#fff', border: 'none', borderRadius: 6, 
                    padding: '8px 28px', fontSize: 13, fontWeight: 500, 
                    cursor: isUpdating ? 'not-allowed' : 'pointer', opacity: isUpdating ? 0.7 : 1 
                  }}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LanguageUpdate;