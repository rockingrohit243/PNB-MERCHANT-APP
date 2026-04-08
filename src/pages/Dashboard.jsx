import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { pnbApi } from '../services/pnbApi';
import { authService } from '../services/authService';
import pnbLogo from '../assets/pnb-logo.png'; // Make sure the logo is here!

const Dashboard = () => {
  const [vpList, setVpList] = useState([]);
  const [merchantName, setMerchantName] = useState('Merchant');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active sidebar link

  useEffect(() => {
    // We will dynamically fetch this from the token later
    const merchantIdentifier = "7574857003"; 

    const loadDashboard = async () => {
      try {
        const response = await pnbApi.fetchById(merchantIdentifier);
        if (response && response.length > 0) {
          setVpList(response);
          setMerchantName(response[0].merchant_name || 'Merchant');
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f4f6f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a32a29]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f6f8] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100 px-6">
          <img src={pnbLogo} alt="PNB Logo" className="h-10 object-contain" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button 
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === '/' ? 'bg-red-50 text-[#a32a29]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>

          <button 
            onClick={() => navigate('/reports')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transaction Reports
          </button>

          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </nav>

        {/* User / Logout Area */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm z-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Merchant Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your Virtual Payment Addresses</p>
          </div>
          
          {/* User Profile Badge */}
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <div className="w-8 h-8 bg-[#a32a29] text-white rounded-full flex items-center justify-center font-bold">
              {merchantName.charAt(0)}
            </div>
            <span className="font-semibold text-gray-700 pr-2">{merchantName}</span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your VPAs</h2>

            {/* VPA Grid */}
            {vpList.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-sm flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-lg text-gray-500 font-medium">No Virtual Payment Addresses found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vpList.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group flex flex-col">
                    
                    {/* Top Section */}
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-red-50 text-[#a32a29] rounded-xl group-hover:bg-[#a32a29] group-hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                          </svg>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {item.status || 'Active'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-1 truncate" title={item.vpa_id}>
                        {item.vpa_id}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        A/C: •••• {item.merchant_account_no?.slice(-4) || 'XXXX'}
                      </p>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                      <button 
                        onClick={() => navigate('/qr', { state: { qrString: item.qr_string } })}
                        className="w-full bg-white border border-gray-200 hover:border-[#a32a29] hover:text-[#a32a29] text-gray-700 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        View QR Code
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;