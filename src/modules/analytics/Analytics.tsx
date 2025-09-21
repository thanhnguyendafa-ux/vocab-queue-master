import React from 'react'
import { useQuizStore } from '../../store/useQuizStore'
import { LineChart, BarChart } from '../../components/charts'

export function Analytics() {
  const { sessionHistory, items } = useQuizStore()
  
  // Calculate metrics
  const masteryData = items.map(item => ({
    id: item.id,
    term: item.term,
    mastery: item.mastery * 100
  }))
  
  const sessionData = sessionHistory.map(session => ({
    date: new Date(session.startedAt).toLocaleDateString(),
    accuracy: session.totalQuestions > 0 
      ? (session.correctAnswers / session.totalQuestions) * 100
      : 0
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Learning Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Mastery Progress</h2>
          <BarChart 
            data={masteryData}
            xField="term"
            yField="mastery"
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Session Accuracy</h2>
          <LineChart
            data={sessionData}
            xField="date"
            yField="accuracy"
          />
        </div>
      </div>
    </div>
  )
}
