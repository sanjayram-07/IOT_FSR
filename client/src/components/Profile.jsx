import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

export default function Profile() {
  const { user, token } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await axios.get('/api/auth/me')
        setProfile(resp.data.user)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])

  if (!profile) return <div className="glass-card p-6">Loading...</div>

  return (
    <div className="app-wrapper">
      <div className="main-content">
        <h2 className="text-2xl font-bold">Profile</h2>
        <div className="glass-card p-6 max-w-md">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}