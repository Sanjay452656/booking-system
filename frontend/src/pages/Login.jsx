import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/login', form);
            login(res.data);
            toast.success(`Welcome back, ${res.data.user.name?.split(' ')[0]}!`);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-content" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', padding: '2rem 1rem',
        }}>
            {/* Background warm glow */}
            <div style={{
                position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
                width: '500px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(212,175,94,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="glass-card anim-scale-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '18px', margin: '0 auto 1rem',
                        background: 'var(--color-accent-dim)',
                        border: '1px solid rgba(212,175,94,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '10px',
                    }}>
                        <img src="/logo.svg" alt="Eventify logo" width="40" height="40" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
                        Welcome back
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        Sign in to your Eventify account
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                    <div className="form-group">
                        <label className="label" htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className={`input ${error ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className={`input ${error ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            background: 'var(--color-danger-dim)', border: '1px solid rgba(184,92,92,0.25)',
                            borderRadius: '8px', padding: '0.625rem 0.875rem',
                            fontSize: '0.8rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}>
                            <span style={{ fontSize: '0.7rem' }}>▲</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ marginTop: '0.25rem' }}
                    >
                        {loading ? <><Spinner size={18} /> Signing in…</> : 'Sign In'}
                    </button>
                </form>

                <div className="divider" />

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                        Create one →
                    </Link>
                </p>
            </div>
        </div>
    );
}