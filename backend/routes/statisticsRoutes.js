// routes/statisticsRoutes.js
const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get Dashboard Statistics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = req.user.initialBalance + income - expense;

    // Category breakdown
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    res.json({
      totalBalance,
      income,
      expense,
      initialBalance: req.user.initialBalance,
      transactionCount: transactions.length,
      categoryBreakdown: categoryTotals
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Server error fetching statistics' });
  }
});

module.exports = router;
