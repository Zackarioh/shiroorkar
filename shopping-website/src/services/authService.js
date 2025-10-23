import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Login a user
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Logout a user
export const logoutUser = async () => {
    try {
        await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get the current user's profile
export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/profile`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};