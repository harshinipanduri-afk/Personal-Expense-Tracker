import axios from 'axios';

const API = axios.create({
    baseURL: 'https://personal-expense-tracker-q55a.onrender.com/api'
});

export default API;