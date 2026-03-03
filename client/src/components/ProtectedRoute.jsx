import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    // you could return a spinner here
    return null
  }

  // avoid redirect if we're already on auth-related pages (catch trailing slashes)
  if (!user && !['/login','/register'].some(p => location.pathname.startsWith(p))) {
    return <Navigate to="/login" replace />
  }

  return children
}