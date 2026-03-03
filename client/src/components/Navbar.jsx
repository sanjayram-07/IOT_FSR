import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const { user, logout } = useContext(AuthContext)
  const menu = [
    { name: 'Dashboard', to: '/' },
    { name: 'Workout', to: '/workout' },
    { name: 'Analysis', to: '/analysis' },
    { name: 'Plan', to: '/plan' },
  ]

  return (
    <nav className={`navbar ${visible ? 'visible' : ''}`}>
      <div className="container">
        <div className="logo">FSR FITNESS</div>
        <div className="menu">
          {menu.map(m => (
            <Link
              key={m.to}
              to={m.to}
              className={location.pathname === m.to ? 'active' : ''}
            >
              {m.name}
            </Link>
          ))}
          {!user && <Link to="/login" className="login-btn">Login</Link>}
          {user && (
            <div className="relative inline-block">
              <button className="avatar-btn" onClick={() => setShowDrop(prev => !prev)}>
                {user.name.charAt(0).toUpperCase()}
              </button>
              {showDrop && (
                <div className="avatar-dropdown">
                  <Link to="/">Dashboard</Link>
                  <Link to="/profile">Profile</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}