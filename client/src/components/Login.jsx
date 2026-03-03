import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login, loading } = useContext(AuthContext)
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    const resp = await login(email, password)
    if (!resp.ok) {
      setError(resp.message)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-bg-gradient"></div>
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-logo">FSR FITNESS</h1>
          <p className="login-subtitle">AI-Powered Fitness Dashboard</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="your@email.com"
                className="login-input"
              />
            </div>

            <div className="form-group relative">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter password"
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-10 text-gray-400"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="form-group flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(r => !r)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm text-gray-200">Remember me</label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '1.5rem' }}>
              Demo mode: Use any email (yopmail.com supported)
            </p>
            <a
              href="https://yopmail.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}
            >
              Create a YopMail account →
            </a>
            <p className="text-center mt-4 text-sm">
              New? <Link to="/register" className="text-blue-400">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
