import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('sh_admin_token');
        if (token) {
            API.get('/admin/verify')
                .then(res => setAdmin(res.data.admin))
                .catch(() => localStorage.removeItem('sh_admin_token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await API.post('/admin/login', { email, password });
        localStorage.setItem('sh_admin_token', res.data.token);
        setAdmin(res.data);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('sh_admin_token');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);