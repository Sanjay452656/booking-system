import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const handleSubmit = async () => {
    const res = await API.post("/auth/login", form);
    login(res.data);
  };

  return (
    <div className="flex flex-col gap-3 p-6 max-w-sm mx-auto">
      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-blue-500 text-white p-2" onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
}