import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

function Dashboard() {

    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    // Transaction Form States
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [editingId, setEditingId] = useState(null);

    // Filter States
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const navigate = useNavigate();

    // Fetch Transactions
    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await API.get('/transactions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTransactions(response.data);

        } catch (err) {
            setError('Unable to load transactions.');
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Reset Form
    const resetForm = () => {
        setAmount('');
        setType('expense');
        setCategory('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setEditingId(null);
    };

    // Add or Update Transaction
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');

            const transactionData = {
                amount: Number(amount),
                type,
                category,
                description,
                date
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (editingId) {
                await API.put(
                    `/transactions/${editingId}`,
                    transactionData,
                    config
                );

                alert('Transaction updated successfully!');

            } else {
                await API.post(
                    '/transactions',
                    transactionData,
                    config
                );

                alert('Transaction added successfully!');
            }

            resetForm();
            await fetchTransactions();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Transaction operation failed.'
            );
        }
    };

    // Edit Transaction
    const handleEdit = (item) => {
        setEditingId(item._id);
        setAmount(item.amount);
        setType(item.type);
        setCategory(item.category);
        setDescription(item.description || '');
        setDate(new Date(item.date).toISOString().split('T')[0]);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Delete Transaction
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this transaction?'
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');

            await API.delete(`/transactions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Transaction deleted successfully!');

            await fetchTransactions();

        } catch (err) {
            setError('Unable to delete transaction.');
        }
    };

    // Calculate Income and Expenses
    const totalIncome = transactions
        .filter(item => item.type === 'income')
        .reduce((total, item) => total + Number(item.amount), 0);

    const totalExpenses = transactions
        .filter(item => item.type === 'expense')
        .reduce((total, item) => total + Number(item.amount), 0);

    const balance = totalIncome - totalExpenses;

    // Expense Category Pie Chart Data
    const expenseData = Object.values(
        transactions
            .filter(item => item.type === 'expense')
            .reduce((acc, item) => {

                const category = item.category;

                if (!acc[category]) {
                    acc[category] = {
                        name: category,
                        value: 0
                    };
                }

                acc[category].value += Number(item.amount);

                return acc;

            }, {})
    );

    // Income vs Expense Bar Chart Data
    const comparisonData = [
        {
            name: 'Income',
            amount: totalIncome
        },
        {
            name: 'Expenses',
            amount: totalExpenses
        }
    ];

    // Chart Colors
    const COLORS = [
        '#8884d8',
        '#82ca9d',
        '#ffc658',
        '#ff8042',
        '#0088FE',
        '#00C49F',
        '#FFBB28',
        '#FF6666'
    ];

    // Filter Transactions
    const filteredTransactions = transactions.filter((item) => {

        const matchesType =
            filterType === 'all' || item.type === filterType;

        const matchesCategory =
            filterCategory === 'all' ||
            item.category === filterCategory;

        const matchesSearch =
            (item.description || '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const transactionDate = new Date(item.date)
            .toISOString()
            .split('T')[0];

        const matchesStartDate =
            !startDate || transactionDate >= startDate;

        const matchesEndDate =
            !endDate || transactionDate <= endDate;

        return (
            matchesType &&
            matchesCategory &&
            matchesSearch &&
            matchesStartDate &&
            matchesEndDate
        );
    });

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (

        <div className="dashboard-container">

            {/* Header */}
            <header className="dashboard-header">

                <h1>Personal Expense Tracker</h1>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </header>

            <h2>Welcome to Your Dashboard!</h2>

            <p>Track your income and expenses in one place.</p>

            {error && (
                <p style={{ color: 'red' }}>{error}</p>
            )}

            {/* Summary Cards */}
            <div className="summary-container">

                <div className="summary-card">
                    <h3>Total Balance</h3>
                    <h2>₹{balance.toFixed(2)}</h2>
                </div>

                <div className="summary-card">
                    <h3>Total Income</h3>
                    <h2>₹{totalIncome.toFixed(2)}</h2>
                </div>

                <div className="summary-card">
                    <h3>Total Expenses</h3>
                    <h2>₹{totalExpenses.toFixed(2)}</h2>
                </div>

            </div>

            {/* Add Transaction Form */}
            <div className="transaction-section">

                <h2>
                    {editingId
                        ? 'Edit Transaction'
                        : 'Add New Transaction'}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>Transaction Type</label>

                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>

                    <label>Amount (₹)</label>

                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        required
                    />

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Travel">Travel</option>
                        <option value="Education">Education</option>
                        <option value="Bills">Bills</option>
                        <option value="Salary">Salary</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Description</label>

                    <input
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <label>Date</label>

                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                    />

                    <button type="submit">
                        {editingId
                            ? 'Update Transaction'
                            : 'Add Transaction'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                        >
                            Cancel Edit
                        </button>
                    )}

                </form>

            </div>

            {/* Expense and Income Charts */}
            <div className="charts-container">

                {/* Pie Chart */}
                <div className="transaction-section">

                    <h2>Expenses by Category</h2>

                    {expenseData.length === 0 ? (

                        <p>No expense data available.</p>

                    ) : (

                        <ResponsiveContainer width="100%" height={300}>

                            <PieChart>

                                <Pie
                                    data={expenseData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >

                                    {expenseData.map((entry, index) => (

                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />

                                    ))}

                                </Pie>

                                <Tooltip />
                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    )}

                </div>

                {/* Bar Chart */}
                <div className="transaction-section">

                    <h2>Income vs Expenses</h2>

                    <ResponsiveContainer width="100%" height={300}>

                        <BarChart data={comparisonData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="name" />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="amount"
                                fill="#8884d8"
                                name="Amount (₹)"
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* Transaction Filters */}
            <div className="transaction-section">

                <h2>Filter Transactions</h2>

                <label>Search by Description</label>

                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <label>Transaction Type</label>

                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                >
                    <option value="all">All Transactions</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <label>Category</label>

                <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                    <option value="Bills">Bills</option>
                    <option value="Salary">Salary</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                </select>

                <label>Start Date</label>

                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />

                <label>End Date</label>

                <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={e => setEndDate(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => {
                        setFilterType('all');
                        setFilterCategory('all');
                        setSearchTerm('');
                        setStartDate('');
                        setEndDate('');
                    }}
                >
                    Clear Filters
                </button>

            </div>

            {/* Recent Transactions */}
            <div className="transaction-section">

                <h2>Recent Transactions</h2>

                {filteredTransactions.length === 0 ? (

                    <p>No matching transactions found.</p>

                ) : (

                    filteredTransactions.map(item => (

                        <div
                            key={item._id}
                            className="transaction-item"
                        >

                            <div>

                                <h3>{item.category}</h3>

                                <p>{item.description}</p>

                                <small>
                                    {new Date(item.date).toLocaleDateString()}
                                </small>

                            </div>

                            <div>

                                <p
                                    style={{
                                        color: item.type === 'income'
                                            ? 'green'
                                            : 'red',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {item.type === 'income' ? '+' : '-'}
                                    ₹{Number(item.amount).toFixed(2)}
                                </p>

                                <button
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default Dashboard;