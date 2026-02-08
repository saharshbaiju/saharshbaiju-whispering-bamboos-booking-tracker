import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { getUsers, addUser } from '../services/mockData';
import './Auth.css';

interface SignupProps {
    onLogin: (username: string) => void;
}

function Signup({ onLogin }: SignupProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }

        setLoading(true);

        try {
            const users = await getUsers();
            const exists = users.some(
                u => u.username.toLowerCase() === username.toLowerCase()
            );

            if (exists) {
                setError('Username already taken');
                setLoading(false);
                return;
            }

            await addUser({ username, password });
            onLogin(username);
        } catch {
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="auth-card card"
            >
                <div className="auth-logo">
                    <h1>Whispering Bamboos</h1>
                    <span>Create Account</span>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label className="label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="input"
                            placeholder="Choose a username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            placeholder="Create a password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="input"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <UserPlus size={18} />
                        {loading ? 'Creating account...' : 'Create Account'}
                    </motion.button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </motion.div>
        </div>
    );
}

export default Signup;
