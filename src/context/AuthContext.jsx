import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                await fetchUserProfile();
            } catch (error) {
                // Token might be invalid
                logout();
            }
        }
        setLoading(false);
    };

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/auth/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile', error);
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login/', { username, password });
            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            await fetchUserProfile();
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
    };

    const signup = async (username, email, password) => {
        try {
            await api.post('/auth/register/', { username, email, password });
            return await login(username, password);
        } catch (error) {
            console.error('Signup failed', error);
            return { success: false, error: error.response?.data || 'Signup failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        // Optional: Redirect to login is handled by ProtectedRoute
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
