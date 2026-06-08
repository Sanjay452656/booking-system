export default function Spinner({ size = 24, className = '' }) {
    return (
        <div
            className={`anim-spin ${className}`}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                border: `2px solid rgba(139,92,246,0.2)`,
                borderTopColor: '#8b5cf6',
                flexShrink: 0,
            }}
        />
    );
}

export function FullPageSpinner() {
    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
        }}>
            <Spinner size={40} />
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading…</span>
        </div>
    );
}
