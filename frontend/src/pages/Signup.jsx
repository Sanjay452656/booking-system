import { useState } from "react";
import API from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER",
  });

  const handleSubmit = async () => {
    await API.post("/auth/signup", form);
    alert("Signup successful");
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

      <select
        className="border p-2"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="ORGANIZER">Organizer</option>
      </select>

      <button className="bg-green-500 text-white p-2" onClick={handleSubmit}>
        Signup
      </button>
    </div>
  );
}