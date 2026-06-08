import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.info('You have been logged out');
        navigate('/');
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <img src="/logo.svg" alt="Eventify logo" width="22" height="22" style={{ flexShrink: 0 }} />
                    Eventify
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                        Browse Events
                    </NavLink>

                    {user?.role === 'ORGANIZER' && (
                        <NavLink to="/create-event" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            + Create Event
                        </NavLink>
                    )}

                    {user && (
                        <NavLink to="/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            My Bookings
                        </NavLink>
                    )}
                </div>

                {/* Desktop Auth */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hidden-mobile">
                    {user ? (
                        <>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                                background: 'var(--color-accent-dim)',
                                borderRadius: '999px',
                                border: '1px solid rgba(212,175,94,0.2)',
                            }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: 'var(--color-accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 700, color: '#0E0C0A',
                                }}>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                                    {user.name?.split(' ')[0]}
                                </span>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"  className="btn btn-ghost btn-sm">Login</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="show-mobile"
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem' }}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div
                    className="anim-slide-down"
                    style={{
                        position: 'absolute', top: '60px', left: 0, right: 0,
                        background: 'rgba(14,12,10,0.97)',
                        borderBottom: '1px solid rgba(240,235,227,0.07)',
                        padding: '1rem 1.5rem',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem',
                        backdropFilter: 'blur(24px)',
                    }}
                >
                    <NavLink to="/" className="nav-link" onClick={closeMenu} end>Browse Events</NavLink>
                    {user?.role === 'ORGANIZER' && (
                        <NavLink to="/create-event" className="nav-link" onClick={closeMenu}>+ Create Event</NavLink>
                    )}
                    {user && <NavLink to="/bookings" className="nav-link" onClick={closeMenu}>My Bookings</NavLink>}
                    <div className="divider" />
                    {user ? (
                        <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ alignSelf: 'flex-start' }}>
                            Logout ({user.name?.split(' ')[0]})
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/login"  className="btn btn-ghost btn-sm"    onClick={closeMenu}>Login</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm"  onClick={closeMenu}>Sign Up</Link>
                        </div>
                    )}
                </div>
            )}

            {/* Mobile responsive styles injected here */}
            <style>{`
                @media (max-width: 640px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile   { display: flex !important; }
                }
                @media (min-width: 641px) {
                    .show-mobile   { display: none !important; }
                    .hidden-mobile { display: flex !important; }
                }
            `}</style>
        </nav>
    );
}