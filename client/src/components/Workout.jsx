import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const API_URL = (window.location.hostname === 'localhost') ? 'http://localhost:8080/api/dashboard' : `${window.location.protocol}//${window.location.host}/api/dashboard`;

export default function Workout() {
  const [live, setLive] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(API_URL)
        const json = await resp.json()
        if (json.ok && json.data) {
          setLive(json.data)
        }
      } catch (e) {
        console.error('Error fetching workout data:', e)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="main-content">
        <section className="hero">
          <div className="bg-gradient"></div>
          <h1>Live Workout Session</h1>
          <p>Monitor your real-time exercise performance</p>
        </section>

        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Records</h2>
          {live.length > 0 ? (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {live.map((r, i) => (
                <div key={i} style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>{r._id.exercise}</strong> / {r._id.variation}
                  <br />
                  <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                    Avg: {r.avg.toFixed(1)}% - Count: {r.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#aaa' }}>Waiting for live data...</p>
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}
