import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function BarChart({ data, xField, yField }: {
  data: Record<string, any>[]
  xField: string
  yField: string
}) {
  const chartData = {
    labels: data.map(item => item[xField]),
    datasets: [{
      label: 'Mastery %',
      data: data.map(item => item[yField]),
      backgroundColor: 'rgba(59, 130, 246, 0.6)'
    }]
  }

  return (
    <Bar 
      data={chartData} 
      options={{
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }} 
    />
  )
}
