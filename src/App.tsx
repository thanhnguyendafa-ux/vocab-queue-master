import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from '../contexts/AppContext'
import { Home } from '../features/home/Home'
import { Study } from '../features/study/Study'
import { Library } from '../features/library/Library'
import { Build } from '../features/build/Build'
import { Settings } from '../features/settings/Settings'
import { Home as HomeIcon, BookOpen, Play, Wrench, Settings as SettingsIcon } from 'lucide-react'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = React.useState(location.pathname)

  const tabs = [
    { id: '/', name: 'Home', icon: HomeIcon },
    { id: '/study', name: 'Study', icon: Play },
    { id: '/library', name: 'Library', icon: BookOpen },
    { id: '/build', name: 'Build', icon: Wrench },
    { id: '/settings', name: 'Settings', icon: SettingsIcon }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    navigate(tabId)
  }

  return (
    <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 md:relative md:border-t-0 md:border-b">
      <div className="flex justify-around md:justify-start md:gap-8 px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center p-2 min-w-0 flex-1 md:flex-none md:px-4 md:py-3
                transition-colors duration-200
                ${isActive
                  ? 'text-blue-600 border-t-2 border-blue-600 md:border-t-0 md:border-b-2'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <Icon size={20} className="mb-1 md:mb-2" />
              <span className="text-xs md:text-sm font-medium truncate">{tab.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/library" element={<Library />} />
          <Route path="/build" element={<Build />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <Navigation />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  )
}

export default App