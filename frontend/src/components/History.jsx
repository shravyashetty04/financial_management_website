import React, { useState } from 'react';
import { History as HistoryIcon, Search, Trash2 } from 'lucide-react';
import { getCategoryIcon } from './Dashboard';

const History = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState('all');

  const filteredData = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="card" style={{ minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{margin: 0}}><HistoryIcon size={24} style={{color: '#818cf8'}} /> Transaction History</h2>
        
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex' }}>
          <button 
            className={`nav-btn ${filter === 'all' ? 'active' : ''}`} 
            style={{ borderRadius: '8px', fontSize: '13px' }}
            onClick={() => setFilter('all')}
          >All</button>
          <button 
            className={`nav-btn ${filter === 'income' ? 'active' : ''}`} 
            style={{ borderRadius: '8px', fontSize: '13px' }}
            onClick={() => setFilter('income')}
          >Income</button>
          <button 
            className={`nav-btn ${filter === 'expense' ? 'active' : ''}`} 
            style={{ borderRadius: '8px', fontSize: '13px' }}
            onClick={() => setFilter('expense')}
          >Expense</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="transactions-table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filteredData.map(t => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{fontWeight: 500}}>{t.description}</td>
                <td><span className="cat-badge">{getCategoryIcon(t.category)} {t.category}</span></td>
                <td className={`amount-text ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                </td>
                <td>
                  <button className="action-btn" onClick={() => onDelete(t.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                  <Search size={48} style={{opacity: 0.2, marginBottom: '10px'}} /><br/>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;