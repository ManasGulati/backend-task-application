import React, { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      window.location.href = '/dashboard';
    } catch (error) {
      const message = error.message || 'Login failed';
      setErr(message);
      alert(`Login error: ${message}`);
    }
  };

  return (
    <div className="page-center">
      <section className="card auth-card">
      <h2>Login</h2>
      {err && <div className="message error">{err}</div>}
      <form className="form-grid" onSubmit={onSubmit}>
        <label className="field-label" htmlFor="login-email">Email</label>
        <input id="login-email" className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <label className="field-label" htmlFor="login-password">Password</label>
        <input id="login-password" className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
      </section>
    </div>
  )
}
