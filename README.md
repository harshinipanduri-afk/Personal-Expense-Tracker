# Personal Expense Tracker 💰

## Project Overview
The Personal Expense Tracker is a web application developed using the MERN Stack. It helps users manage their personal finances by recording income and expenses, monitoring their balance, and analyzing spending patterns.

## Technologies Used
- MongoDB – Database
- Express.js – Backend framework
- React.js – Frontend library
- Node.js – Server environment
- JWT – Authentication
- Recharts – Charts and data visualization
- Axios – API communication

## Features
- User Registration and Login
- JWT-based Authentication
- Protected Dashboard
- Add Income and Expense Transactions
- Edit and Delete Transactions
- Calculate Total Income, Expenses, and Balance
- Pie Chart and Bar Chart
- Search Transactions
- Filter by Category, Type, and Date
- Logout Functionality

## Project Structure
```text
Personal_Expense_Tracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## Installation and Execution

### Backend Setup
Open a terminal and execute:

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend Setup
Open another terminal and execute:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL