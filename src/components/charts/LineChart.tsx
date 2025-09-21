import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export function LineChart({ data, xField, yField }: {
  data: Record<string, any>[]
  xField: string
  yField: string
}) {
  const chartData = {
    labels: data.map(item => item[xField]),
    datasets: [{
      label: 'Accuracy %',
      data: data.map(item => item[yField]),
      borderColor: 'rgba(16, 185, 129, 0.8)',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      tension: 0.3
    }]
  }

  return (
    <Line 
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
