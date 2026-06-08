import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim())           errs.name = 'Name is required';
        if (!form.email.trim())          errs.email = 'Email is required';
        if (form.password.length < 6)    errs.password = 'Password must be at least 6 characters';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            // Fixed: correct endpoint is /auth/register (not /auth/signup)
            await API.post('/auth/register', form);
            // Auto-login after successful registration
            const res = await API.post('/auth/login', { email: form.email, password: form.password });
            login(res.data);
            toast.success(`Account created! Welcome, ${form.name.split(' ')[0]}!`);
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ id, label, type = 'text', placeholder, name }) => (
        <div className="form-group">
            <label className="label" htmlFor={id}>{label}</label>
            <input
                id={id} name={name || id} type={type}
                className={`input ${errors[name || id] ? 'input-error' : ''}`}
                placeholder={placeholder}
                value={form[name || id]}
                onChange={handleChange}
                autoComplete={type === 'password' ? 'new-password' : type === 'email' ? 'email' : 'off'}
            />
            {errors[name || id] && <span className="error-text">⚠ {errors[name || id]}</span>}
        </div>
    );

    return (
        <div className="page-content" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', padding: '2rem 1rem',
        }}>
            <div style={{
                position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
                width: '500px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="glass-card anim-scale-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
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
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.375rem' }}>
                        Create your account
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        Join thousands of event-goers on Eventify
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                    <Field id="name"     label="Full Name"       placeholder="John Doe" />
                    <Field id="email"    label="Email Address"   placeholder="you@example.com" type="email" />
                    <Field id="password" label="Password"        placeholder="Min. 6 characters" type="password" />

                    {/* Role selector */}
                    <div className="form-group">
                        <label className="label" htmlFor="role">I am joining as a</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                            {[
                                { value: 'USER', label: '🎟 Attendee', sub: 'Browse & book events' },
                                { value: 'ORGANIZER', label: '🎤 Organizer', sub: 'Create & manage events' },
                            ].map(({ value, label, sub }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setForm({ ...form, role: value })}
                                    style={{
                                        padding: '0.875rem 0.75rem',
                                        borderRadius: '10px',
                                        border: form.role === value
                                            ? '2px solid #8b5cf6'
                                            : '1px solid rgba(139,92,246,0.2)',
                                        background: form.role === value
                                            ? 'rgba(139,92,246,0.12)'
                                            : 'transparent',
                                        color: form.role === value ? '#c4b5fd' : '#94a3b8',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <div style={{ fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.875rem' }}>{label}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{sub}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: '0.25rem' }}>
                        {loading ? <><Spinner size={18} /> Creating account…</> : 'Create Account'}
                    </button>
                </form>

                <div className="divider" />

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in →
                    </Link>
                </p>
            </div>
        </div>
    );
}