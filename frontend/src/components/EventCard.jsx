import { useNavigate } from 'react-router-dom';

// Warm editorial gradient palette — no neon/cyan/purple
const GRADIENTS = [
    'linear-gradient(135deg, #2C2016 0%, #4A3520 100%)', // Warm Umber
    'linear-gradient(135deg, #1A2018 0%, #2D3C24 100%)', // Forest Night
    'linear-gradient(135deg, #1C1A2A 0%, #2E2840 100%)', // Midnight Plum
    'linear-gradient(135deg, #251C14 0%, #3E2E1C 100%)', // Burnt Sienna
    'linear-gradient(135deg, #1A2228 0%, #243340 100%)', // Deep Slate
    'linear-gradient(135deg, #201618 0%, #382224 100%)', // Dark Rose
];

// Minimal line-art style symbols (no emoji)
const CATEGORY_SYMBOLS = ['♩', '◈', '◻', '◆', '▷', '○'];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(price) {
    if (price === 0) return 'Free';
    return `₹${price.toLocaleString('en-IN')}`;
}

export default function EventCard({ event, index = 0 }) {
    const navigate = useNavigate();
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const symbol = CATEGORY_SYMBOLS[index % CATEGORY_SYMBOLS.length];
    const seatsLeft = event.availableSeats;
    const seatsLow = seatsLeft > 0 && seatsLeft <= 20;
    const soldOut = seatsLeft === 0;
    const delay = `anim-delay-${Math.min((index % 6) + 1, 6)}`;

    return (
        <div
            className={`glass-card glass-card-lift event-card anim-fade-up ${delay}`}
            onClick={() => navigate(`/events/${event._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/events/${event._id}`)}
        >
            {/* Image / Gradient header */}
            <div
                className="event-card-header"
                style={event.image
                    ? {
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }
                    : { background: gradient }
                }
            >
                {/* Dark overlay so badges stay readable over photos */}
                {event.image && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.45) 100%)',
                    }} />
                )}

                {/* Decorative symbol — shown only when no image */}
                {!event.image && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', fontWeight: 300,
                        color: 'rgba(240,235,227,0.1)',
                        fontFamily: 'serif',
                        letterSpacing: '-0.02em',
                    }}>
                        {symbol}
                    </div>
                )}

                {/* Seats badge — top right */}
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
                    {soldOut ? (
                        <span className="badge badge-cancelled">Sold Out</span>
                    ) : seatsLow ? (
                        <span className="badge badge-seats-low">{seatsLeft} left</span>
                    ) : (
                        <span className="badge badge-seats-ok">{seatsLeft} seats</span>
                    )}
                </div>

                {/* Price badge — top left */}
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 2 }}>
                    <span className="price-tag" style={{
                        padding: '3px 10px', borderRadius: '999px',
                        background: 'rgba(14,12,10,0.6)', backdropFilter: 'blur(8px)',
                        fontSize: '0.75rem',
                    }}>
                        {formatPrice(event.price)}
                    </span>
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <h3 style={{
                    fontSize: '0.9375rem', fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    letterSpacing: '-0.01em',
                }}>
                    {event.title}
                </h3>

                {event.description && (
                    <p style={{
                        fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.55,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                        {event.description}
                    </p>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>◷</span>
                        <span>{formatDate(event.date)}</span>
                    </div>
                    {event.organiser?.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>◎</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.organiser.email}</span>
                        </div>
                    )}
                </div>

                {/* CTA bar */}
                <div style={{
                    marginTop: '0.75rem',
                    padding: '0.625rem 0 0',
                    borderTop: '1px solid var(--color-border-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {soldOut ? 'Unavailable' : 'Book now'}
                    </span>
                    <span style={{
                        fontSize: '0.78rem', fontWeight: 600,
                        color: soldOut ? 'var(--color-text-muted)' : 'var(--color-accent)',
                    }}>
                        {soldOut ? '—' : 'View →'}
                    </span>
                </div>
            </div>
        </div>
    );
}
