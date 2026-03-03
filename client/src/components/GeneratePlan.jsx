import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function GeneratePlan() {
  const [form, setForm] = useState({ bmi: '', goal: '', muscle: '', variation: '', percentage: '' })
  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      bmi: parseFloat(form.bmi) || 0,
      goal: form.goal,
      muscle: form.muscle,
      variation: form.variation,
      percentage: parseFloat(form.percentage) || 0,
    }
    try {
      const resp = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await resp.json()
      if (json.ok) {
        setResult(json.plan)
      } else {
        setResult(`Error: ${json.error}`)
      }
    } catch (err) {
      setResult(`Request failed: ${err.message}`)
    }
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="main-content">
        <section className="hero">
          <div className="bg-gradient"></div>
          <h1>AI Plan Generator</h1>
          <p>Get personalized fitness plans powered by Google Gemini AI</p>
        </section>
        <div className="generate-card-wrapper">
          <div className="glass-card generate-card">
            <h2 className="generate-title">Generate Your Plan</h2>
            <form onSubmit={handleSubmit} className="generate-form">
              <input
                name="bmi"
                value={form.bmi}
                onChange={handleChange}
                placeholder="BMI"
                className="input-field"
              />
              <input
                name="goal"
                value={form.goal}
                onChange={handleChange}
                placeholder="Goal"
                className="input-field"
              />
              <input
                name="muscle"
                value={form.muscle}
                onChange={handleChange}
                placeholder="Muscle"
                className="input-field"
              />
              <input
                name="variation"
                value={form.variation}
                onChange={handleChange}
                placeholder="Variation"
                className="input-field"
              />
              <input
                name="percentage"
                value={form.percentage}
                onChange={handleChange}
                placeholder="Average Pressure (%)"
                className="input-field"
              />
              <button
                type="submit"
                className="generate-button"
              >
                Generate
              </button>
            </form>
            {result && (
              <div className="result-box">
                {result}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}