import React from 'react'

export default function DietPlan({ diet }) {
  diet = diet || { calories: '-', protein: '-', carbs: '-', fat: '-', meals: [] }
  return (
    <div className="glass-card diet-plan">
      <h3>Diet Plan</h3>
      <p>Calories: <strong>{diet.calories}</strong></p>
      <p>Protein: <strong>{diet.protein}</strong></p>
      <p>Carbs: <strong>{diet.carbs}</strong></p>
      <p>Fat: <strong>{diet.fat}</strong></p>
      <div className="meals">
        {diet.meals.map((m,i)=>(
          <div key={i}>• {m}</div>
        ))}
      </div>
    </div>
  )
}