import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('wb_user') !== null;
    });

    useEffect(() => {
        const handleStorage = () => {
            setIsAuthenticated(localStorage.getItem('wb_user') !== null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLogin = (username: string) => {
        localStorage.setItem('wb_user', username);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('wb_user');
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ?
                            <Navigate to="/dashboard" replace /> :
                            <Login onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        isAuthenticated ?
                            <Navigate to="/dashboard" replace /> :
                            <Signup onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ?
                            <Dashboard onLogout={handleLogout} /> :
                            <Navigate to="/login" replace />
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
