import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import { FullPageSpinner } from '../components/Spinner';
import Spinner from '../components/Spinner';

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

function StatusBadge({ status }) {
    const map = { PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed', CANCELLED: 'badge-cancelled' };
    const icons = { PENDING: '⏳', CONFIRMED: '✓', CANCELLED: '✕' };
    return (
        <span className={`badge ${map[status] || 'badge-pending'}`}>
            {icons[status]} {status}
        </span>
    );
}

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [cancelling, setCancelling] = useState(null); // bookingId being cancelled
    const toast = useToast();

    const fetchBookings = () => {
        setLoading(true);
        API.get('/bookings/my')
            .then((res) => setBookings(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Cancel this booking? Seats will be released back.')) return;
        setCancelling(bookingId);
        try {
            await API.post('/bookings/cancel', { bookingId });
            setBookings((prev) =>
                prev.map((b) => b._id === bookingId ? { ...b, status: 'CANCELLED' } : b)
            );
            toast.success('Booking cancelled. Seats have been released.');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setCancelling(null);
        }
    };

    const grouped = {
        CONFIRMED: bookings.filter((b) => b.status === 'CONFIRMED'),
        PENDING:   bookings.filter((b) => b.status === 'PENDING'),
        CANCELLED: bookings.filter((b) => b.status === 'CANCELLED'),
    };

    return (
        <div className="page-content">
            <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
                {/* Page header */}
                <div className="anim-fade-up" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.375rem' }}>
                        My Bookings
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        All your event reservations in one place
                    </p>
                </div>

                {loading && <FullPageSpinner />}

                {error && !loading && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
                        <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>
                        <button className="btn btn-ghost btn-sm" onClick={fetchBookings}>Try Again</button>
                    </div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🎟</div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#e2e8f0' }}>No bookings yet</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                            You haven&apos;t booked any events. Discover what&apos;s happening near you!
                        </p>
                        <Link to="/" className="btn btn-primary">Browse Events →</Link>
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {/* Summary chips */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {Object.entries(grouped).map(([status, list]) => list.length > 0 && (
                                <div key={status} style={{
                                    padding: '0.4rem 1rem', borderRadius: '999px',
                                    fontSize: '0.78rem', fontWeight: 600,
                                    background: status === 'CONFIRMED' ? 'rgba(16,185,129,0.1)' : status === 'PENDING' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                    color: status === 'CONFIRMED' ? '#34d399' : status === 'PENDING' ? '#fbbf24' : '#f87171',
                                    border: `1px solid ${status === 'CONFIRMED' ? 'rgba(16,185,129,0.2)' : status === 'PENDING' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                }}>
                                    {list.length} {status.toLowerCase()}
                                </div>
                            ))}
                        </div>

                        {/* Booking cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bookings.map((booking, i) => {
                                const ev = booking.event;
                                const isPending = booking.status === 'PENDING';
                                return (
                                    <div
                                        key={booking._id}
                                        className={`glass-card anim-fade-up anim-delay-${Math.min(i + 1, 6)}`}
                                        style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}
                                    >
                                        {/* Left: color bar */}
                                        <div style={{
                                            width: '4px', borderRadius: '4px', alignSelf: 'stretch', flexShrink: 0,
                                            background: booking.status === 'CONFIRMED'
                                                ? 'linear-gradient(to bottom, #10b981, #06b6d4)'
                                                : booking.status === 'PENDING'
                                                ? 'linear-gradient(to bottom, #f59e0b, #f97316)'
                                                : 'rgba(239,68,68,0.5)',
                                        }} />

                                        {/* Center: info */}
                                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
                                                    {ev?.title || 'Event Deleted'}
                                                </h3>
                                                <StatusBadge status={booking.status} />
                                            </div>

                                            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                                                {ev?.date && (
                                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        📅 {formatDate(ev.date)}
                                                    </span>
                                                )}
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    🎟 {booking.quantity} seat{booking.quantity > 1 ? 's' : ''}
                                                </span>
                                                {ev?.price != null && (
                                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        💰 {ev.price === 0 ? 'Free' : `₹${(ev.price * booking.quantity).toLocaleString('en-IN')}`}
                                                    </span>
                                                )}
                                            </div>

                                            {isPending && booking.expiresAt && (
                                                <div style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    ⏱ Expires: {new Date(booking.expiresAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}

                                            <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                                                Booked on {formatDate(booking.createdAt)}
                                            </div>
                                        </div>

                                        {/* Right: actions */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                            {ev?._id && (
                                                <Link
                                                    to={`/events/${ev._id}`}
                                                    className="btn btn-ghost btn-sm"
                                                >
                                                    View Event
                                                </Link>
                                            )}
                                            {isPending && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleCancel(booking._id)}
                                                    disabled={cancelling === booking._id}
                                                >
                                                    {cancelling === booking._id
                                                        ? <><Spinner size={14} /> Cancelling…</>
                                                        : 'Cancel'
                                                    }
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
