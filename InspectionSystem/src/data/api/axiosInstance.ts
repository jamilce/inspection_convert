import axios from 'axios';

const baseURL = 'http://localhost:63406/api/'; // Can be moved to environment variables later

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to inject the token or language preference
axiosInstance.interceptors.request.use((config) => {
    // In a real scenario, fetch this from Redux or localStorage
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('lang') || 'ar';

    if (token && config.headers) {
        config.headers.authorization = token;
    }
    if (config.headers) {
        config.headers['Accept-Language'] = lang;
    }
    return config;
});

// Response interceptor for generic error handling (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error, possibly redirect to login or clear state
            console.warn('Unauthorized. Logging out...');
        }
        return Promise.reject(error);
    }
);
