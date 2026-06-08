import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';
import CreateEvent from './pages/CreateEvent';

// ProtectedRoute — redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}

// RoleRoute — only allows users with a specific role
function RoleRoute({ children, role }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== role) return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public */}
                <Route path="/"           element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/login"      element={<Login />} />
                <Route path="/signup"     element={<Signup />} />

                {/* Protected — any logged-in user */}
                <Route path="/bookings" element={
                    <ProtectedRoute><MyBookings /></ProtectedRoute>
                } />

                {/* Protected — ORGANIZER only */}
                <Route path="/create-event" element={
                    <RoleRoute role="ORGANIZER"><CreateEvent /></RoleRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}
