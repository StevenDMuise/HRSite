import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%)',
    }}>
      <div style={{
        background: '#fff',
        padding: '2.5rem 2.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        minWidth: 340,
        textAlign: 'center',
      }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 12 }}>My Application Tracker</h1>
        <p style={{ color: '#64748b', marginBottom: 28, fontSize: 18 }}>
          Organize your job search, track applications, and stay on top of your career journey.
        </p>
        <Link to="/login" style={{
          display: 'inline-block',
          padding: '0.85rem 2.5rem',
          background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)',
          color: '#fff',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(14,165,233,0.10)',
        }}>
          Get Started
        </Link>
        <div style={{ marginTop: 32, color: '#94a3b8', fontSize: 14 }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
