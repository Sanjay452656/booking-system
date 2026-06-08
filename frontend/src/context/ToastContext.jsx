import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Convenience helpers
    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error:   (msg) => addToast(msg, 'error'),
        info:    (msg) => addToast(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastRenderer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastRenderer({ toasts, onRemove }) {
    const icons = { success: '✓', error: '✕', info: 'ℹ' };

    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`toast toast-${t.type} anim-fade-up`}
                    onClick={() => onRemove(t.id)}
                >
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{icons[t.type]}</span>
                    <span style={{ flex: 1 }}>{t.message}</span>
                    <button
                        onClick={() => onRemove(t.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, color: 'inherit', fontSize: '1rem', padding: 0 }}
                    >×</button>
                </div>
            ))}
        </div>
    );
}

export const useToast = () => useContext(ToastContext);
