import React from 'react'

export default function LivePressureCard({ percentage = 0, rawValue = 0 }) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  let colorClass = 'text-red-500'
  if (percentage >= 40 && percentage <= 70) colorClass = 'text-orange-500'
  else if (percentage > 70) colorClass = 'text-green-500'

  return (
    <div className="glass-card live-pressure-card">
      <svg>
        <circle
          cx="60"
          cy="60"
          r="60"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="bg-circle"
        />
        <circle
          cx="60"
          cy="60"
          r="60"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} progress-circle`}
        />
      </svg>
      <div className={`percent ${colorClass}`}>{percentage.toFixed(1)}%</div>
      <div className="raw">Raw: {rawValue}</div>
    </div>
  )
}