const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');

const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactionController');

// Protect all transaction routes
router.use(protect);

// Add a transaction
router.post('/', addTransaction);

// Get all transactions
router.get('/', getTransactions);

// Update a transaction
router.put('/:id', updateTransaction);

// Delete a transaction
router.delete('/:id', deleteTransaction);

module.exports = router;