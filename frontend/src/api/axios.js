import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// REQUEST INTERCEPTOR — automatically attach JWT to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// RESPONSE INTERCEPTOR — normalize errors so all components receive
// a consistent error shape: error.message is always a readable string.
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred';

        // If 401, the token is invalid/expired — clear storage so the
        // user doesn't get stuck in a broken authenticated state.
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        // Re-throw a plain Error with the clean message so catch blocks
        // in components can do: catch(err) { setError(err.message) }
        return Promise.reject(new Error(message));
    }
);

export default API;