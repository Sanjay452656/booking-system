import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from './pages/Login';
import Signup from './pages/SignUp';

createRoot(document.getElementById('root')).render(
   <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Login/>
        <Signup/>
      </BrowserRouter>
    </AuthProvider>,
)
