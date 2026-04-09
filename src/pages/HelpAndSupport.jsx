import React from 'react';
import { useNavigate } from 'react-router-dom';

const HelpAndSupport = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.pageContainer}>
            {/* 1. Injecting CSS Keyframes for the animations */}
            <style>
                {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          @keyframes blink {
            0%, 94%, 98%, 100% { transform: scaleY(1); }
            96% { transform: scaleY(0.1); }
          }
          @keyframes pulse {
            0% { opacity: 0.6; fill: #f26522; filter: drop-shadow(0 0 4px #f26522); }
            50% { opacity: 1; fill: #ffb74d; filter: drop-shadow(0 0 12px #ffb74d); }
            100% { opacity: 0.6; fill: #f26522; filter: drop-shadow(0 0 4px #f26522); }
          }
          .floating-bot {
            animation: float 3.5s ease-in-out infinite;
            margin-bottom: 2rem;
          }
          .bot-eye {
            transform-origin: center;
            animation: blink 4s infinite;
          }
          .bot-antenna {
            animation: pulse 2s infinite;
          }
        `}
            </style>

            {/* 2. The Animated SVG Cartoon Logo */}
            <div className="floating-bot">
                <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                    {/* Antenna Stem */}
                    <line x1="100" y1="40" x2="100" y2="10" stroke="#a32a29" strokeWidth="6" strokeLinecap="round" />
                    {/* Glowing Antenna Bulb */}
                    <circle cx="100" cy="10" r="8" className="bot-antenna" />

                    {/* Headset Band */}
                    <path d="M 40 100 A 60 60 0 0 1 160 100" fill="none" stroke="#333" strokeWidth="8" strokeLinecap="round" />

                    {/* Headset Earpieces */}
                    <rect x="30" y="80" width="20" height="40" rx="10" fill="#f26522" />
                    <rect x="150" y="80" width="20" height="40" rx="10" fill="#f26522" />
                    {/* Microphone */}
                    <path d="M 160 110 Q 140 140 110 135" fill="none" stroke="#333" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="108" cy="135" r="6" fill="#555" />

                    {/* Main Robot Face */}
                    <rect x="50" y="45" width="100" height="85" rx="20" fill="#fff" stroke="#a32a29" strokeWidth="6" />

                    {/* Eyes */}
                    <circle cx="80" cy="80" r="10" fill="#111" className="bot-eye" />
                    <circle cx="120" cy="80" r="10" fill="#111" className="bot-eye" />

                    {/* Friendly Smile */}
                    <path d="M 85 105 Q 100 120 115 105" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
                </svg>
            </div>

            {/* 3. The Text Content */}
            <h1 style={styles.heading}>Help & Support is Coming Soon!</h1>
            <p style={styles.subtext}>
                Our engineering team is setting up a comprehensive support center.
                Check back soon for FAQs, ticketing, and live chat features!
            </p>

            {/* 4. Navigation Back */}
            <button
                onClick={() => navigate(-1)}
                style={styles.button}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                Go Back to Dashboard
            </button>

        </div>
    );
};

// ── Styles ─────────────────────────────────────────────────────────────
const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '2rem',
        textAlign: 'center',
    },
    heading: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#111',
        marginBottom: '1rem',
    },
    subtext: {
        fontSize: '1rem',
        color: '#666',
        maxWidth: '500px',
        lineHeight: '1.6',
        marginBottom: '2.5rem',
    },
    button: {
        backgroundColor: '#a32a29',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 32px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(163, 42, 41, 0.25)',
        transition: 'transform 0.2s ease',
    }
};

export default HelpAndSupport;