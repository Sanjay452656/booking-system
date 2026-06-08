import { useState, useEffect } from 'react';
import API from '../api/axios';
import EventCard from '../components/EventCard';
import { FullPageSpinner } from '../components/Spinner';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        API.get('/events')
            .then((res) => setEvents(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = events.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-content">
            {/* ── Hero ───────────────────────────────── */}
            <section style={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '520px',
                display: 'flex',
                alignItems: 'center',
            }}>
                {/* Full-bleed background image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(/hero-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 40%',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 0,
                }} />

                {/* Layered dark overlay — keeps text readable */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: `
                        linear-gradient(to right, rgba(14,12,10,0.92) 0%, rgba(14,12,10,0.65) 60%, rgba(14,12,10,0.4) 100%),
                        linear-gradient(to top,   rgba(14,12,10,1)    0%, transparent 50%)
                    `,
                }} />

                {/* Warm gold bloom — bottom left */}
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '5%',
                    width: '420px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(212,175,94,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none', zIndex: 2,
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 3, padding: 'clamp(4rem, 8vw, 6.5rem) 1.5rem clamp(3.5rem, 6vw, 5rem)' }}>
                    {/* Section label */}
                    <div className="anim-fade-up">
                        <span className="section-label">Live Events</span>
                    </div>

                    <h1 className="anim-fade-up" style={{
                        fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.03em',
                        margin: '1.25rem 0 1rem',
                        maxWidth: '640px',
                        textShadow: '0 2px 40px rgba(0,0,0,0.6)',
                    }}>
                        Discover Events<br />
                        <span style={{
                            color: 'var(--color-accent)',
                            fontWeight: 500,
                        }}>You&apos;ll Remember</span>
                    </h1>

                    <p className="anim-fade-up anim-delay-1" style={{
                        fontSize: '1.05rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '460px',
                        lineHeight: 1.7,
                        marginBottom: '2.25rem',
                        textShadow: '0 1px 12px rgba(0,0,0,0.5)',
                    }}>
                        Browse concerts, workshops, and meetups. Book your seat in seconds.
                    </p>

                    {/* Search bar */}
                    <div className="anim-fade-up anim-delay-2" style={{ maxWidth: '480px', position: 'relative' }}>
                        <span style={{
                            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                            fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none',
                            fontFamily: 'var(--font-mono)',
                        }}>/ /</span>
                        <input
                            className="input"
                            style={{
                                paddingLeft: '3rem', height: '52px',
                                fontSize: '0.9rem', borderRadius: '12px',
                                background: 'rgba(14,12,10,0.75)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(240,235,227,0.12)',
                            }}
                            placeholder="Search events by name or description…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* ── Events Grid ───────────────────────────────── */}
            <section style={{ padding: '1rem 0 4rem' }}>
                <div className="container">
                    {/* Stats bar */}
                    {!loading && !error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem',
                        }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    Showing{' '}
                                    <strong style={{ color: 'var(--color-accent)' }}>{filtered.length}</strong>
                                    {search && ` of ${events.length}`} events
                                </span>
                            </div>
                            {search && (
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setSearch('')}
                                >
                                    × Clear search
                                </button>
                            )}
                        </div>
                    )}

                    {/* States */}
                    {loading && <FullPageSpinner />}

                    {error && !loading && (
                        <div style={{
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '12px', padding: '2rem', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
                            <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>
                            <button className="btn btn-ghost btn-sm" onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">&#9633;</div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                {search ? 'No events found' : 'No events yet'}
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                {search ? `No events match "${search}"` : 'Check back soon for upcoming events!'}
                            </p>
                            {search && (
                                <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && !error && filtered.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.25rem',
                        }}>
                            {filtered.map((event, i) => (
                                <EventCard key={event._id} event={event} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
