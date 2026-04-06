import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between p-4 bg-gray-900 text-white">
      <Link to="/" className="font-bold">Eventify</Link>

      <div className="space-x-4">
        {user?.role === "ORGANIZER" && (
          <Link to="/create">Create Event</Link>
        )}

        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}