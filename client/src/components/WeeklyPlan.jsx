import React from 'react'

const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function WeeklyPlan({ plan }) {
  // plan is an array of 7 objects { muscle, variation, icon }
  return (
    <div className="glass-card weekly-plan">
      <h3>Weekly Plan</h3>
      <div className="grid">
        {days.map((d,i)=>{
          const item = plan && plan[i] ? plan[i] : { muscle:'-', variation:'-', icon:'💪' }
          return (
            <div key={d} className="day">
              <div className="date">{d}</div>
              <div className="muscle">{item.muscle}</div>
              <div className="variation">{item.variation}</div>
              <div className="icon">{item.icon}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}