const Transaction = require('../models/Transaction');

// Add Transaction
const addTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body;

        if (!amount || !type || !category) {
            return res.status(400).json({
                message: 'Please provide amount, type and category'
            });
        }

        const transaction = await Transaction.create({
            user: req.user.id,
            amount,
            type,
            category,
            description,
            date
        });

        res.status(201).json({
            message: 'Transaction added successfully',
            transaction
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            user: req.user.id
        }).sort({ date: -1 });

        res.status(200).json(transactions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Transaction
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
};