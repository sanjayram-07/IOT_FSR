import React from 'react'

const options = {
  'Bicep Curl': ['Dumbbell Curl', 'Cable Curl', 'Rod Curl'],
  'Tricep Extension': ['Cable Extension', 'Rod Extension'],
  'Shoulder Press': ['Arnold Press', 'Dumbbell Press', 'Smith Machine Press'],
}

export default function ExerciseSelection({ exercise, variation, onExerciseChange, onVariationChange }) {
  const handleExercise = (e) => {
    onExerciseChange(e.target.value)
  }
  const handleVariation = (e) => {
    onVariationChange(e.target.value)
  }

  return (
    <div className="glass-card exercise-selection">
      <div className="field">
        <label>Exercise</label>
        <select value={exercise} onChange={handleExercise}>
          <option value="">Select</option>
          {Object.keys(options).map(ex => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Variation</label>
        <select value={variation} onChange={handleVariation} disabled={!exercise}>
          <option value="">Select</option>
          {exercise && options[exercise].map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
    </div>
  )
}