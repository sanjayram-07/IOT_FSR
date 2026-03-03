import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const obj = JSON.parse(stored)
      setUser(obj.user)
      setToken(obj.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${obj.token}`
    }
  }, [])

  const saveSession = (u, t) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('auth', JSON.stringify({ user: u, token: t }))
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const clearSession = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth')
    delete axios.defaults.headers.common['Authorization']
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const resp = await axios.post('/api/auth/login', { email, password })
      saveSession(resp.data.user, resp.data.token)
      setLoading(false)
      toast.success('Logged in successfully')
      navigate('/')
      return { ok: true }
    } catch (err) {
      setLoading(false)
      toast.error(err.response?.data?.message || 'Login failed')
      return { ok: false, message: err.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const resp = await axios.post('/api/auth/register', { name, email, password })
      saveSession(resp.data.user, resp.data.token)
      setLoading(false)
      toast.success('Registration successful')
      navigate('/')
      return { ok: true }
    } catch (err) {
      setLoading(false)
      toast.error(err.response?.data?.message || 'Register failed')
      return { ok: false, message: err.response?.data?.message || 'Register failed' }
    }
  }

  const logout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
