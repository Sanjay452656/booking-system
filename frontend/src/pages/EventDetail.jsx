import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FullPageSpinner } from '../components/Spinner';
import Spinner from '../components/Spinner';

const GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

// Dynamically load the Razorpay script (it's too large to bundle)
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) { resolve(true); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
}

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    const [event, setEvent]         = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [quantity, setQuantity]   = useState(1);
    const [booking, setBooking]     = useState(false); // payment flow in progress
    const [booked, setBooked]       = useState(false); // payment confirmed

    useEffect(() => {
        API.get(`/events/${id}`)
            .then((res) => setEvent(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    // ── Payment flow ───────────────────────────────────────────
    const handleBook = async () => {
        if (!user) { navigate('/login'); return; }

        setBooking(true);
        try {
            // 1. Load Razorpay script
            const ok = await loadRazorpayScript();
            if (!ok) { toast.error('Could not load payment gateway. Please try again.'); return; }

            // 2. Create a PENDING booking — seats reserved
            const bRes = await API.post('/bookings', { eventId: event._id, quantity });
            const bookingId = bRes.data.booking._id;

            // 3. Create a Razorpay order
            const oRes = await API.post('/payments/create-order', { bookingId });

            // 4. Open Razorpay checkout modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                amount: oRes.data.amount,
                currency: oRes.data.currency,
                name: 'Eventify',
                description: event.title,
                order_id: oRes.data.orderId,
                prefill: { name: user.name, email: user.email },
                theme: { color: '#8b5cf6' },

                // On successful payment
                handler: async (response) => {
                    try {
                        await API.post('/payments/verify', {
                            razorpay_order_id:   response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature:  response.razorpay_signature,
                            bookingId,
                        });
                        setBooked(true);
                        // Update available seats locally
                        setEvent((prev) => ({ ...prev, availableSeats: prev.availableSeats - quantity }));
                        toast.success('🎉 Payment successful! Booking confirmed.');
                    } catch (err) {
                        toast.error(`Verification failed: ${err.message}`);
                    }
                },

                modal: {
                    ondismiss: () => {
                        toast.info('Payment cancelled. Your seat hold will expire in 5 minutes.');
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            toast.error(err.message);
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <div className="page-content"><FullPageSpinner /></div>;

    if (error || !event) return (
        <div className="page-content container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
            <h2 style={{ color: '#f1f5f9', marginBottom: '0.5rem' }}>Event not found</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
            <Link to="/" className="btn btn-primary">← Back to Events</Link>
        </div>
    );

    const gradient = GRADIENTS[event._id?.charCodeAt(0) % GRADIENTS.length] || GRADIENTS[0];
    const soldOut = event.availableSeats === 0;
    const seatsLow = event.availableSeats > 0 && event.availableSeats <= 20;

    return (
        <div className="page-content">
            {/* ── Hero Banner ─────────────────────────────── */}
            <div style={{
            height: '320px', position: 'relative', overflow: 'hidden',
            background: event.image ? '#0a0a0a' : gradient,
        }}>
            {/* Photo background */}
            {event.image && (
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${event.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 40%',
                }} />
            )}

            {/* Overlay — darkens image / gradient for readability */}
            <div style={{
                position: 'absolute', inset: 0,
                background: event.image
                    ? 'linear-gradient(to bottom, rgba(7,11,24,0.25) 0%, rgba(7,11,24,0.88) 100%)'
                    : 'linear-gradient(to bottom, rgba(7,11,24,0.1) 0%, rgba(7,11,24,0.85) 100%)',
            }} />

            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end' }}>
                <div className="container" style={{ paddingBottom: '2rem' }}>
                    <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        ← Back to Events
                    </Link>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
                        {event.title}
                    </h1>
                </div>
            </div>
        </div>

            {/* ── Content ────────────────────────────────── */}
            <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '2rem', alignItems: 'start' }}>

                    {/* Left: Event Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Info chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {[
                                { icon: '📅', label: formatDate(event.date) },
                                { icon: '💺', label: `${event.totalSeats} total seats` },
                                { icon: '💰', label: event.price === 0 ? 'Free Entry' : `₹${event.price.toLocaleString('en-IN')} per seat` },
                                { icon: '👤', label: event.organiser?.email || 'Organizer' },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 0.875rem', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    fontSize: '0.83rem', color: '#94a3b8',
                                }}>
                                    <span>{icon}</span><span>{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Seats availability bar */}
                        <div className="glass-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>SEAT AVAILABILITY</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: seatsLow ? '#fbbf24' : soldOut ? '#f87171' : '#34d399' }}>
                                    {soldOut ? 'Sold Out' : `${event.availableSeats} / ${event.totalSeats} available`}
                                </span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: '3px',
                                    width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                                    background: soldOut ? '#ef4444' : seatsLow
                                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                        : 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                                    transition: 'width 0.5s ease',
                                }} />
                            </div>
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.875rem' }}>
                                    About this Event
                                </h2>
                                <p style={{ color: '#94a3b8', lineHeight: 1.75, fontSize: '0.9rem' }}>
                                    {event.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Booking Widget */}
                    <div style={{ position: 'sticky', top: '80px' }}>
                        {booked ? (
                            // Success state
                            <div className="glass-card anim-scale-in" style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
                                    Booking Confirmed!
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                    Your {quantity} seat{quantity > 1 ? 's are' : ' is'} secured. Check your bookings for details.
                                </p>
                                <Link to="/bookings" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    View My Bookings
                                </Link>
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>
                                        Reserve Your Seat
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Seats are held for 5 minutes after selection</p>
                                </div>

                                <div className="divider" style={{ margin: 0 }} />

                                {/* Quantity selector */}
                                <div>
                                    <label className="label" style={{ marginBottom: '0.625rem' }}>Number of seats</label>
                                    <div className="qty-stepper">
                                        <button className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1 || soldOut}>−</button>
                                        <span className="qty-value">{quantity}</span>
                                        <button className="qty-btn" onClick={() => setQuantity((q) => Math.min(event.availableSeats, q + 1))} disabled={quantity >= event.availableSeats || soldOut}>+</button>
                                    </div>
                                </div>

                                {/* Price breakdown */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', color: '#94a3b8' }}>
                                        <span>₹{event.price?.toLocaleString('en-IN')} × {quantity} seat{quantity > 1 ? 's' : ''}</span>
                                        <span>₹{(event.price * quantity)?.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem' }}>
                                        <span>Total</span>
                                        <span style={{ color: '#a78bfa' }}>
                                            {event.price === 0 ? 'Free' : `₹${(event.price * quantity)?.toLocaleString('en-IN')}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Availability warning */}
                                {seatsLow && (
                                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '0.625rem 0.875rem', fontSize: '0.78rem', color: '#fbbf24', display: 'flex', gap: '0.5rem' }}>
                                        🔥 Only {event.availableSeats} seats left! Book quickly.
                                    </div>
                                )}

                                {/* Book button */}
                                {soldOut ? (
                                    <button className="btn btn-ghost btn-lg" disabled style={{ width: '100%', justifyContent: 'center' }}>
                                        Sold Out
                                    </button>
                                ) : !user ? (
                                    <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                                        Sign in to Book
                                    </Link>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={handleBook}
                                        disabled={booking}
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        {booking
                                            ? <><Spinner size={18} /> Processing…</>
                                            : event.price === 0 ? '🎟 Book for Free' : '💳 Pay & Confirm'
                                        }
                                    </button>
                                )}

                                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#475569', lineHeight: 1.5 }}>
                                    🔒 Secured by Razorpay. Seats held for 5 min after selection.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile: responsive styles */}
                <style>{`
                    @media (max-width: 768px) {
                        .detail-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
            </div>
        </div>
    );
}
