// routes/transactionRoutes.js
const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, category, startDate, endDate, limit } = req.query;
    
    const query = { userId: req.userId };

    // Apply filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    let transactionsQuery = Transaction.find(query).sort({ date: -1, createdAt: -1 });
    
    if (limit) {
      transactionsQuery = transactionsQuery.limit(parseInt(limit));
    }

    const transactions = await transactionsQuery;

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error fetching transactions' });
  }
});

// Get Single Transaction
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Server error fetching transaction' });
  }
});

// Create Transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    // Validation
    if (!description || !amount || !type || !category || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    const transaction = new Transaction({
      userId: req.userId,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date)
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Server error creating transaction' });
  }
});

// Update Transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update fields
    if (description) transaction.description = description;
    if (amount) transaction.amount = parseFloat(amount);
    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (date) transaction.date = new Date(date);

    await transaction.save();

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Server error updating transaction' });
  }
});

// Delete Transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Server error deleting transaction' });
  }
});

module.exports = router;
