import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const FIELDS = [
    { id: 'title',       label: 'Event Title',       type: 'text',     placeholder: 'e.g. React Workshop 2025',  required: true },
    { id: 'description', label: 'Description',        type: 'textarea', placeholder: 'Tell attendees what to expect…', required: false },
    { id: 'date',        label: 'Event Date & Time',  type: 'datetime-local', placeholder: '',                   required: true },
    { id: 'price',       label: 'Ticket Price (₹)',   type: 'number',   placeholder: '0 for free events',        required: true },
    { id: 'totalSeats',  label: 'Total Seats',        type: 'number',   placeholder: 'e.g. 200',                 required: true },
];

export default function CreateEvent() {
    const [form, setForm] = useState({
        title: '', description: '', date: '', price: '', totalSeats: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setErrors((prev) => ({ ...prev, [e.target.id]: '' }));
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const validate = () => {
        const errs = {};
        if (!form.title.trim())     errs.title = 'Title is required';
        if (!form.date)             errs.date  = 'Date is required';
        if (new Date(form.date) <= new Date()) errs.date = 'Event date must be in the future';
        if (form.price === '' || isNaN(form.price) || Number(form.price) < 0)
            errs.price = 'Price must be 0 or more';
        if (!form.totalSeats || Number(form.totalSeats) < 1)
            errs.totalSeats = 'Must have at least 1 seat';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            const res = await API.post('/events', {
                ...form,
                price:      Number(form.price),
                totalSeats: Number(form.totalSeats),
            });
            toast.success('Event created successfully!');
            navigate(`/events/${res.data._id}`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-content">
            <div className="container" style={{ padding: '3rem 1.5rem 5rem', maxWidth: '760px' }}>
                {/* Header */}
                <div className="anim-fade-up" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.375rem' }}>
                        Create an Event
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        Fill in the details below to publish your event for attendees to discover and book.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '1.5rem', alignItems: 'start' }}>
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="glass-card anim-fade-up" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {FIELDS.map(({ id, label, type, placeholder, required }) => (
                            <div key={id} className="form-group">
                                <label className="label" htmlFor={id}>
                                    {label} {required && <span style={{ color: '#f87171' }}>*</span>}
                                </label>
                                {type === 'textarea' ? (
                                    <textarea
                                        id={id}
                                        className={`input ${errors[id] ? 'input-error' : ''}`}
                                        placeholder={placeholder}
                                        value={form[id]}
                                        onChange={handleChange}
                                        rows={4}
                                        style={{ resize: 'vertical', minHeight: '100px' }}
                                    />
                                ) : (
                                    <input
                                        id={id}
                                        type={type}
                                        className={`input ${errors[id] ? 'input-error' : ''}`}
                                        placeholder={placeholder}
                                        value={form[id]}
                                        onChange={handleChange}
                                        min={type === 'number' ? 0 : undefined}
                                    />
                                )}
                                {errors[id] && <span className="error-text">⚠ {errors[id]}</span>}
                            </div>
                        ))}

                        <div className="divider" style={{ margin: '0.25rem 0' }} />

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? <><Spinner size={18} /> Publishing event…</> : '🚀 Publish Event'}
                        </button>
                    </form>

                    {/* Preview card */}
                    <div style={{ position: 'sticky', top: '88px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            Preview
                        </div>
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            {/* Header */}
                            <div style={{
                                height: '100px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem', opacity: 0.8,
                            }}>🎤</div>

                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>
                                    {form.title || 'Your Event Title'}
                                </h3>
                                {form.date && (
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                        📅 {new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa' }}>
                                        {form.price === '0' || form.price === 0 ? 'Free' : form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '₹—'}
                                    </span>
                                    {form.totalSeats && (
                                        <span className="badge badge-seats-ok">{form.totalSeats} seats</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>💡 Tips</p>
                            <ul style={{ fontSize: '0.73rem', color: '#64748b', lineHeight: 1.7, paddingLeft: '1rem' }}>
                                <li>Use a descriptive title to attract attendees</li>
                                <li>Set price to 0 for free events</li>
                                <li>Add a detailed description for better discovery</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <style>{`
                    @media (max-width: 640px) {
                        .create-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
            </div>
        </div>
    );
}
