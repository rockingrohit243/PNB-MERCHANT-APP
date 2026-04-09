import React, { useEffect } from 'react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: type === 'error' ? '#fef2f2' : '#ecfdf3',
      borderLeft: `4px solid ${type === 'error' ? '#d92d20' : '#027a48'}`,
      padding: '16px 24px', borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', gap: 12,
      minWidth: '250px', maxWidth: '400px',
      transition: 'all 0.3s ease'
    }}>
      <span style={{ 
        fontSize: 14, fontWeight: 500, 
        color: type === 'error' ? '#b42318' : '#027a48' 
      }}>
        {message}
      </span>
      <button onClick={onClose} style={{
        marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
        color: '#666', fontSize: 16, padding: 0
      }}>×</button>
    </div>
  );
};

export default Toast;