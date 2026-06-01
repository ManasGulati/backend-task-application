import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  return (
    <nav className="navbar">
      <div className="nav-brand">TaskFlow</div>
      <div className="nav-links">
        <Link className="nav-link" to="/">Home</Link>
        {user ? <Link className="nav-link" to="/dashboard">Dashboard</Link> : null}
        {user && user.role === 'admin' ? <Link className="nav-link" to="/admin">Admin</Link> : null}
      </div>
      <div className="nav-actions">
        {!user ? (
          <>
            <Link className="btn btn-ghost" to="/login">Login</Link>
            <Link className="btn btn-primary" to="/register">Register</Link>
          </>
        ) : (
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  )
}
