import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('finance_user')) || null);
  const [initialBalance, setInitialBalance] = useState(() => parseFloat(localStorage.getItem('finance_initial_balance')) || 50000);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('finance_transactions')) || []);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    localStorage.setItem('finance_initial_balance', initialBalance.toString());
  }, [transactions, initialBalance]);

  const addTransaction = (txn) => setTransactions([txn, ...transactions]);
  
  const deleteTransaction = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const updateBalance = () => {
    const newBal = prompt("Update Initial Balance (₹):", initialBalance);
    if (newBal && !isNaN(newBal)) setInitialBalance(parseFloat(newBal));
  };

  const handleLogin = (userData) => {
    localStorage.setItem('finance_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('finance_user');
    setUser(null);
  };

  // --- Fixed Full Screen Background ---
  const Background = () => (
    <div className="background-wrapper">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </div>
  );

  return (
    <Router>
      <Background />
      <div className="container">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/login" element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/" element={user ? (
            <Dashboard 
              transactions={transactions} 
              initialBalance={initialBalance}
              onAdd={addTransaction}
              onDelete={deleteTransaction}
              onEditBalance={updateBalance}
            />
          ) : <Navigate to="/login" />} />
          <Route path="/history" element={user ? (
            <History transactions={transactions} onDelete={deleteTransaction} />
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;