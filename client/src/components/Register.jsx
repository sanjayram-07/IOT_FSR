import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const { register, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!name || !email || !password || !confirm) {
      setError('All fields are required')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters')
      return
    }
    const resp = await register(name, email, password)
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
          <p className="login-subtitle">Create your account</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="Full name"
                className="login-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="your@email.com"
                className="login-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Enter password"
                className="login-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError('') }}
                placeholder="Confirm password"
                className="login-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing up...' : 'Register'}
            </button>
          </form>

          <div className="login-footer">
            <p className="text-center mt-4 text-sm">
              Already have an account? <Link to="/login" className="text-blue-400">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}