import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, Wallet, UserCircle } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="header">
      <div className="nav-group">
        <div style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <Wallet size={20} color="white" />
        </div>
        <h1 style={{fontSize: '18px', fontWeight: '600', letterSpacing: '-0.5px', color: 'white'}}>FinanceFlow</h1>
      </div>
      
      <div className="nav-group">
        <button 
          className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
        
        <button 
          className={`nav-btn ${location.pathname === '/history' ? 'active' : ''}`}
          onClick={() => navigate('/history')}
        >
          <History size={18} /> History
        </button>

        <div style={{width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 10px'}}></div>

        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginRight: '10px', color: '#94a3b8', fontSize: '14px'}}>
          <UserCircle size={18} />
          <span>{user.name}</span>
        </div>

        <button className="nav-btn logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;