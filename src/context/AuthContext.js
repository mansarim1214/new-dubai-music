import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Simulate fetching user data or token from localStorage/API
        const token = localStorage.getItem('token');
        if (token) {
            // Replace with actual token decoding and user fetching logic
            const userData = { role: 'admin' }; // Example user with admin role
            setUser(userData);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
