import { BrowserRouter } from 'react-router-dom'
import { Routes } from './app/routes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes />
      </div>
    </BrowserRouter>
  )
}

export default App
