import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Wallet } from 'lucide-react';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const storedUser = JSON.parse(localStorage.getItem('registered_user'));
      if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
        onLogin(storedUser);
      } else {
        setError('Invalid credentials. Try signing up first.');
      }
    } else {
      if(formData.name && formData.email && formData.password) {
        localStorage.setItem('registered_user', JSON.stringify(formData));
        onLogin(formData);
      } else {
        setError('Please fill in all fields.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <div style={{ background: 'rgba(129, 140, 248, 0.2)', padding: '12px', borderRadius: '12px' }}>
          <Wallet size={40} />
        </div>
        <h1 style={{fontSize: '28px', fontWeight: 'bold'}}>FinanceFlow</h1>
      </div>
      
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{color: '#94a3b8', marginBottom: '24px', fontSize: '14px'}}>
          {isLogin ? 'Enter your details to access your dashboard' : 'Start managing your finances today'}
        </p>
        
        {error && <div style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px'}}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <div style={{position: 'relative'}}>
                <User size={18} style={{position: 'absolute', top: '14px', left: '14px', color: '#64748b'}} />
                <input 
                  type="text" placeholder="Full Name" style={{paddingLeft: '40px'}}
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <div style={{position: 'relative'}}>
              <Mail size={18} style={{position: 'absolute', top: '14px', left: '14px', color: '#64748b'}} />
              <input 
                type="email" placeholder="Email Address" style={{paddingLeft: '40px'}}
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <div style={{position: 'relative'}}>
              <Lock size={18} style={{position: 'absolute', top: '14px', left: '14px', color: '#64748b'}} />
              <input 
                type="password" placeholder="Password" style={{paddingLeft: '40px'}}
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <button className="btn-primary">
            {isLogin ? 'Login' : 'Get Started'} <ArrowRight size={18} />
          </button>
        </form>

        <button className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New here? Create an account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;