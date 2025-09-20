import React, { useState, useEffect } from 'react'
import { useQuizStore } from '../../store/useQuizStore'
import { StudySetup } from './components/StudySetup'
import { StudySession } from './components/StudySession'
import { StudyResults } from './components/StudyResults'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { BookOpen, Clock, Target, TrendingUp, Play, RotateCcw } from 'lucide-react'

export function Study() {
  const { 
    currentSession, 
    sessionHistory, 
    projects, 
    items,
    startSession,
    resumeSession,
    getSessionStats
  } = useQuizStore()
  
  const [showSetup, setShowSetup] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Check if there's a session to resume
  const resumableSession = sessionHistory.find(s => !s.completed && s.quitCount > 0)
  
  // Calculate stats for dashboard
  const totalItems = items.length
  const masteredItems = items.filter(item => item.passed2 > 0).length
  const recentSessions = sessionHistory.slice(-5)
  const averageAccuracy = recentSessions.length > 0 
    ? recentSessions.reduce((sum, session) => {
        const accuracy = session.totalQuestions > 0 ? (session.correctAnswers / session.totalQuestions) * 100 : 0
        return sum + accuracy
      }, 0) / recentSessions.length
    : 0

  useEffect(() => {
    // Show results when session completes
    if (currentSession?.completed) {
      setShowResults(true)
    }
  }, [currentSession])

  // If there's an active session, show the study session component
  if (currentSession && !currentSession.completed) {
    return <StudySession />
  }

  // If showing results
  if (showResults && currentSession?.completed) {
    return (
      <StudyResults 
        session={currentSession}
        onClose={() => setShowResults(false)}
        onStartNew={() => {
          setShowResults(false)
          setShowSetup(true)
        }}
      />
    )
  }

  // If showing setup
  if (showSetup) {
    return (
      <StudySetup 
        onCancel={() => setShowSetup(false)}
        onStart={(projectId, options) => {
          startSession(projectId, options)
          setShowSetup(false)
        }}
      />
    )
  }

  // Main study dashboard
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Center</h1>
          <p className="text-gray-600 mt-2">
            Master your vocabulary with spaced repetition learning
          </p>
        </div>
        
        <div className="flex gap-3">
          {resumableSession && (
            <Button
              variant="outline"
              onClick={() => resumeSession(resumableSession.id)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resume Session
            </Button>
          )}
          
          <Button
            onClick={() => setShowSetup(true)}
            className="flex items-center gap-2"
            disabled={projects.length === 0}
          >
            <Play className="h-4 w-4" />
            Start Study Session
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vocabulary</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Items in library
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastered</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{masteredItems}</div>
            <p className="text-xs text-muted-foreground">
              {totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              Total completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageAccuracy)}%</div>
            <p className="text-xs text-muted-foreground">
              Last 5 sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Study</CardTitle>
            <CardDescription>
              Start studying with recommended settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Available</h3>
                <p className="text-gray-500 mb-4">
                  Create a project and add vocabulary items to start studying
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/library'}>
                  Go to Library
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 3).map(project => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-500">{project.items.length} items</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        startSession(project.id, { maxItems: 20 })
                      }}
                    >
                      Study
                    </Button>
                  </div>
                ))}
                
                {projects.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowSetup(true)}
                  >
                    View All Projects
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>
              Your latest study activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No study sessions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map(session => {
                  const project = projects.find(p => p.id === session.projectId)
                  const accuracy = session.totalQuestions > 0 
                    ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
                    : 0
                  
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{project?.name || 'Unknown Project'}</h4>
                        <p className="text-sm text-gray-500">
                          {session.totalQuestions} questions • {accuracy}% accuracy
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{accuracy}%</div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.startedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Study Tips</CardTitle>
          <CardDescription>
            Maximize your learning effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Consistent Practice</h3>
              <p className="text-sm text-gray-600">
                Study for 15-20 minutes daily for better retention than long, infrequent sessions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">Focus on Weak Areas</h3>
              <p className="text-sm text-gray-600">
                Use focus filters to target vocabulary items that need more practice.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">
                Monitor your accuracy and mastery rates to see your improvement over time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
