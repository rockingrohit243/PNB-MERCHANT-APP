import React, { useState, useEffect } from 'react';
import { IconSearch, IconDownload } from '../common/Icons';

const ReportTable = ({ data, searchTerm, setSearchTerm, onDownload, isDownloading }) => {
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToInput, setGoToInput] = useState('');

  // Reset to page 1 whenever the data changes (e.g., user types in search or fetches new dates)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, searchTerm]);

  // Derived calculations (Ensure at least 1 page to avoid errors)
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Format Date from API
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  };

  // Handle 'Go To' input enter key
  const handleGoTo = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(goToInput, 10);
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
      setGoToInput(''); // clear input after jumping
    }
  };

  // Generate dynamic pagination array based strictly on data length
  const getPaginationGroup = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0' }}>
      
      {/* Table Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <IconSearch />
          </div>
          <input 
            type="text" 
            placeholder="Search here..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid #e2e2e2', borderRadius: 6, fontSize: 13, outline: 'none' }}
          />
        </div>

        <button 
          onClick={onDownload} 
          disabled={isDownloading || data.length === 0}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 8, background: '#a32a29', color: '#fff', 
            border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 500, 
            cursor: (isDownloading || data.length === 0) ? 'not-allowed' : 'pointer', 
            opacity: (isDownloading || data.length === 0) ? 0.7 : 1 
          }}
        >
          <IconDownload />
          {isDownloading ? 'Processing...' : 'Download'}
        </button>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={thStyle}>S. No.</th>
              <th style={thStyle}>Transaction ID</th>
              <th style={thStyle}>RRN Number</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((row, idx) => {
              // Calculate actual row number based on current page
              const actualRowNumber = (currentPage - 1) * rowsPerPage + idx + 1;
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={tdStyle}>{actualRowNumber}</td>
                  <td style={tdStyle}>{row.Transaction_Id || 'N/A'}</td>
                  <td style={tdStyle}>{row.Transaction_Id || 'N/A'}</td> {/* Using Txn ID as RRN fallback per API payload */}
                  <td style={tdStyle}>{row.Transaction_Amount ? row.Transaction_Amount.toLocaleString() : '0'}</td>
                  <td style={tdStyle}>{formatDate(row['Date_&_Time'])}</td>
                  <td style={tdStyle}>
                    <span style={{ background: '#ecfdf3', color: '#027a48', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
                      Received
                    </span>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: 14 }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer - ONLY RENDERS IF DATA EXISTS */}
      {data.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#666' }}>
            <span>Row per page</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{ border: '1px solid #ddd', borderRadius: 4, padding: '4px 8px', outline: 'none' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            
            <span>Go to</span>
            <input 
              type="text" 
              value={goToInput}
              onChange={(e) => setGoToInput(e.target.value.replace(/\D/g, ''))} // only allow numbers
              onKeyDown={handleGoTo}
              placeholder={currentPage}
              style={{ width: 45, border: '1px solid #ddd', borderRadius: 4, padding: '4px 8px', textAlign: 'center', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
             <PageBtn 
               label="<" 
               disabled={currentPage === 1} 
               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
             />
             
             {getPaginationGroup().map((item, index) => (
               item === '...' ? (
                 <span key={index} style={{ color: '#888', padding: '4px 8px' }}>...</span>
               ) : (
                 <PageBtn 
                   key={index} 
                   label={item} 
                   active={currentPage === item} 
                   onClick={() => setCurrentPage(item)} 
                 />
               )
             ))}

             <PageBtn 
               label=">" 
               disabled={currentPage === totalPages} 
               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
             />
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const thStyle = { padding: '14px 24px', fontSize: 12, fontWeight: 600, color: '#444' };
const tdStyle = { padding: '14px 24px', fontSize: 13, color: '#222' };

// Reusable Page Button Component
const PageBtn = ({ label, active, disabled, onClick }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    style={{ 
      border: active ? '1px solid #a32a29' : '1px solid #ddd', 
      background: active ? '#fdf2f2' : '#fff', 
      color: active ? '#a32a29' : '#444',
      padding: '4px 10px', minWidth: '32px', borderRadius: 4, fontSize: 13, 
      cursor: disabled ? 'not-allowed' : 'pointer', 
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.2s ease'
    }}
  >
    {label}
  </button>
);

export default ReportTable;