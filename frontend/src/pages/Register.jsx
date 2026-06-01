import React, { useState } from 'react'
import { register } from '../api/authApi'
import { getApiErrorMessage } from '../utils/errorMessage'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setMsg('Registered successfully. Please login.');
    } catch (err) {
      const message = getApiErrorMessage(err, 'Registration failed');
      setMsg(message);
      alert(`Registration error: ${message}`);
    }
  };

  return (
    <div className="page-center">
      <section className="card auth-card">
      <h2>Register</h2>
      {msg && <div className={msg.includes('successfully') ? 'message success' : 'message error'}>{msg}</div>}
      <form className="form-grid" onSubmit={onSubmit}>
        <label className="field-label" htmlFor="register-name">Name</label>
        <input id="register-name" className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} />
        <label className="field-label" htmlFor="register-email">Email</label>
        <input id="register-email" className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <label className="field-label" htmlFor="register-password">Password</label>
        <input id="register-password" className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
      </section>
    </div>
  )
}
