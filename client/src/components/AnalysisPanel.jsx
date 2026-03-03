import React from 'react'

export default function AnalysisPanel({ avg, prevAvg, improvement, recommended, level }) {
  const impClass = improvement >= 0 ? 'text-green-400' : 'text-red-400'
  const arrow = improvement >= 0 ? '↑' : '↓'

  return (
    <div className="glass-card analysis-panel">
      <h3>Analysis</h3>
      <p>Average Percentage: <strong>{avg.toFixed(1)}%</strong></p>
      <p>Previous Average: <strong>{prevAvg.toFixed(1)}%</strong></p>
      <p className={`improvement ${improvement>=0 ? 'up' : 'down'}`}>Improvement: <strong>{arrow}{Math.abs(improvement).toFixed(1)}%</strong></p>
      <p>Recommended Variation: <strong>{recommended || '—'}</strong></p>
      <p>Level: <span className="level-badge">{level}</span></p>
    </div>
  )
}