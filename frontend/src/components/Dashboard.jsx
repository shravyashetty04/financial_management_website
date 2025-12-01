import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { 
  Wallet, TrendingUp, TrendingDown, Edit2, Plus, 
  PieChart, Trash2
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

// Icon mapping helper
export const getCategoryIcon = (cat) => {
  // You can import this from a utility file if preferred
  return <span className="cat-badge">{cat}</span>; 
};

const Dashboard = ({ transactions, initialBalance, onAdd, onDelete, onEditBalance }) => {
  const [form, setForm] = useState({
    description: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().split('T')[0]
  });

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = initialBalance + income - expense;

  const expensesList = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};
  expensesList.forEach(t => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount; });

  const chartData = {
    labels: Object.keys(categoryTotals).length ? Object.keys(categoryTotals) : ['No Data'],
    datasets: [{
      data: Object.keys(categoryTotals).length ? Object.values(categoryTotals) : [1],
      backgroundColor: ['#f472b6', '#818cf8', '#34d399', '#fbbf24', '#60a5fa', '#f87171', '#a78bfa'],
      borderWidth: 0,
    }]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date
    });
    setForm({ ...form, description: '', amount: '' });
  };

  return (
    <div style={{width: '100%', animation: 'fadeIn 0.5s ease'}}>
      
      {/* 1. Stats Grid (Stretches Full Screen) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>Current Balance <button className="edit-btn-small" onClick={onEditBalance}><Edit2 size={12} /></button></h3>
            <div className="amount">₹{totalBalance.toFixed(2)}</div>
          </div>
          <div className="icon-box balance"><Wallet size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total Income</h3>
            <div className="amount text-success">+₹{income.toFixed(2)}</div>
          </div>
          <div className="icon-box income"><TrendingUp size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <div className="amount text-danger">-₹{expense.toFixed(2)}</div>
          </div>
          <div className="icon-box expense"><TrendingDown size={24} /></div>
        </div>
      </div>

      {/* 2. Dashboard Split Layout (Chart Left, Form Right) */}
      <div className="dashboard-layout">
        
        {/* Left: Spending Analysis Chart */}
        <div className="card chart-container">
          <h2><PieChart size={20} style={{color: '#818cf8'}} /> Spending Analysis</h2>
          <div style={{ flex: 1, minHeight: '300px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                cutout: '70%', 
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: {family: 'Inter', size: 12}, padding: 20 } } } 
              }} 
            />
          </div>
        </div>

        {/* Right: New Transaction Form */}
        <div className="card">
          <h2><Plus size={20} style={{color: '#818cf8'}} /> Add Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <input 
                type="text" placeholder="e.g. Salary, Rent, Coffee" required 
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input 
                  type="number" placeholder="0.00" step="0.01" required 
                  value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Salary">Salary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" required 
                  value={form.date} onChange={e => setForm({...form, date: e.target.value})} 
                />
              </div>
            </div>
            <button className="btn-primary">Add Transaction</button>
          </form>
        </div>
      </div>

      {/* 3. Recent Activity (Full Width Table) */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>Recent Activity</h2>
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Action</th></tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.description}</td>
                  <td><span className="cat-badge">{t.category}</span></td>
                  <td className={`amount-text ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => onDelete(t.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;