import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const API_URL = (window.location.hostname === 'localhost') ? 'http://localhost:8080/api/dashboard' : `${window.location.protocol}//${window.location.host}/api/dashboard`;

export default function Analysis() {
  const [aggregated, setAggregated] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(API_URL)
        const json = await resp.json()
        if (json.ok && json.data) {
          setAggregated(json.data)
        }
      } catch (e) {
        console.error('Error fetching analytics data:', e)
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
          <h1>Performance Analytics</h1>
          <p>Deep dive into your exercise data and metrics</p>
        </section>

        <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Aggregated Averages by Exercise</h2>
          {aggregated.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {aggregated.map(item => (
                <div
                  key={item._id.exercise + '|' + item._id.variation}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {item._id.exercise}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
                    Variation: {item._id.variation}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#4ade80' }}>
                    {item.avg.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
                    {item.count} readings
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#aaa' }}>No data available yet. Start a workout session to see analytics.</p>
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}
