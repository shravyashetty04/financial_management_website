import React, { useState } from 'react';

const History = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState('all');

  const filteredData = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="card" style={{ minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Transaction History</h2>
        <div>
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'income' ? 'active' : ''}`} onClick={() => setFilter('income')}>Income</button>
          <button className={`filter-btn ${filter === 'expense' ? 'active' : ''}`} onClick={() => setFilter('expense')}>Expense</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="transactions-table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filteredData.map(t => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td><span className={`type-badge ${t.type}`}>{t.type}</span></td>
                <td style={{color: t.type === 'income' ? 'var(--success)' : '#ff7675', fontWeight: 600}}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                </td>
                <td><button className="delete-btn" onClick={() => onDelete(t.id)}>Delete</button></td>
              </tr>
            ))}
            {filteredData.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No records found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;