import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import LivePressureCard from './LivePressureCard'
import ExerciseSelection from './ExerciseSelection'
import AnalysisPanel from './AnalysisPanel'
import WeeklyPlan from './WeeklyPlan'
import DietPlan from './DietPlan'
import Footer from './Footer'

const API_URL = (window.location.hostname === 'localhost') ? 'http://localhost:8080/iot/latest' : `${window.location.protocol}//${window.location.host}/iot/latest`;

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [liveData, setLiveData] = useState(null)
  const [history, setHistory] = useState([])
  const [exercise, setExercise] = useState('')
  const [variation, setVariation] = useState('')

  // computed analysis values
  const avg = history.length ? history.reduce((a,b)=>a+b.percentage,0)/history.length : 0
  const prevAvg = history.length > 5 ? history.slice(5).reduce((a,b)=>a+b.percentage,0)/(history.length-5) : 0
  const improvement = prevAvg ? ((avg - prevAvg)/prevAvg)*100 : 0
  const level = avg < 40 ? 'Beginner' : avg < 70 ? 'Intermediate' : 'Advanced'
  let recommended = ''
  if (exercise) {
    const optMap = {
      'Bicep Curl': ['Dumbbell Curl', 'Cable Curl', 'Rod Curl'],
      'Tricep Extension': ['Cable Extension', 'Rod Extension'],
      'Shoulder Press': ['Arnold Press', 'Dumbbell Press', 'Smith Machine Press'],
    }
    const opts = optMap[exercise] || []
    recommended = opts.find(v=>v !== variation) || opts[0] || ''
  }

  // placeholder plans
  const weeklyPlan = [
    { muscle:'Chest', variation:'Bench', icon:'🏋️'},
    { muscle:'Back', variation:'Row', icon:'💪' },
    { muscle:'Legs', variation:'Squat', icon:'🦵' },
    { muscle:'Shoulders', variation:'Press', icon:'🤸' },
    { muscle:'Arms', variation:'Curl', icon:'💪' },
    { muscle:'Core', variation:'Plank', icon:'🧘' },
    { muscle:'Rest', variation:'—', icon:'😴' },
  ]

  const dietPlan = {
    calories: '2200 kcal',
    protein: '150g',
    carbs: '250g',
    fat: '70g',
    meals: ['Oatmeal with fruits', 'Grilled chicken salad', 'Quinoa bowl with veggies'],
  }

  useEffect(() => {
    setLoaded(true)
    
    const fetchLatestReading = async () => {
      try {
        const resp = await fetch(API_URL)
        const json = await resp.json()
        if (json.ok && json.data) {
          setLiveData(json.data)
          setHistory(prev => {
            // Only add if it's new (different from last item)
            if (prev.length === 0 || prev[0]._id !== json.data._id) {
              return [json.data, ...prev].slice(0, 50)
            }
            return prev
          })
        }
      } catch (e) {
        console.error('Error fetching data:', e)
      }
    }

    // Fetch immediately on mount
    fetchLatestReading()
    
    // Poll every 500ms
    const interval = setInterval(fetchLatestReading, 500)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="main-content">
        <Hero />
        <div className={`centered-card ${loaded ? 'visible' : ''}`}>
          <LivePressureCard
            percentage={liveData ? liveData.percentage : 0}
            rawValue={liveData ? liveData.rawValue : 0}
          />
        </div>
        <div className="panels-wrapper">
          <ExerciseSelection
            exercise={exercise}
            variation={variation}
            onExerciseChange={val => { setExercise(val); setVariation('') }}
            onVariationChange={setVariation}
          />
          <AnalysisPanel
            avg={avg}
            prevAvg={prevAvg}
            improvement={improvement}
            recommended={recommended}
            level={level}
          />
        </div>
        <WeeklyPlan plan={weeklyPlan} />
        <DietPlan diet={dietPlan} />
        <Footer />
      </div>
    </div>
  )
}