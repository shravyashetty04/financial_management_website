// frontend/src/App.jsx - Updated to use Backend API
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Navbar from './components/Navbar';

import { authAPI, transactionAPI } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('finance_user')) || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch transactions when user logs in
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionAPI.getAll();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // If token is invalid, logout
      if (error.message.includes('Authentication') || error.message.includes('Invalid')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (txn) => {
    try {
      const data = await transactionAPI.create(txn);
      setTransactions([data.transaction, ...transactions]);
      return data.transaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction: ' + error.message);
      throw error;
    }
  };
  
  const deleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionAPI.delete(id);
        setTransactions(transactions.filter(t => t._id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction: ' + error.message);
      }
    }
  };

  const updateBalance = async () => {
    const newBal = prompt("Update Initial Balance (₹):", user.initialBalance);
    if (newBal && !isNaN(newBal)) {
      try {
        await authAPI.updateBalance(parseFloat(newBal));
        const updatedUser = { ...user, initialBalance: parseFloat(newBal) };
        setUser(updatedUser);
        localStorage.setItem('finance_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating balance:', error);
        alert('Failed to update balance: ' + error.message);
      }
    }
  };

  const handleLogin = (userData) => {
    localStorage.setItem('finance_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('finance_user');
    setUser(null);
    setTransactions([]);
  };

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
              initialBalance={user.initialBalance}
              onAdd={addTransaction}
              onDelete={deleteTransaction}
              onEditBalance={updateBalance}
              loading={loading}
            />
          ) : <Navigate to="/login" />} />
          <Route path="/history" element={user ? (
            <History 
              transactions={transactions} 
              onDelete={deleteTransaction} 
              loading={loading} 
            />
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;