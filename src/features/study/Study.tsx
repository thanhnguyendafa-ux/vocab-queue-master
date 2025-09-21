import React, { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import { QueueService, QuizQuestion, QueueItem } from '../../services/queueService'
import {
  Play, CheckCircle, XCircle, RotateCcw, Eye, EyeOff,
  Settings, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react'

interface StudySetup {
  projectId?: string
  tableIds: string[]
  filters: any[]
  sortBy: string
  groupBy?: string
  wordCount: number
  selectedModules: string[]
}

export function Study() {
  const { state, dispatch } = useApp()
  const [showSetup, setShowSetup] = useState(true)
  const [setup, setSetup] = useState<StudySetup>({
    tableIds: [],
    filters: [],
    sortBy: 'keyword',
    wordCount: 10,
    selectedModules: []
  })

  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  const [speedMode, setSpeedMode] = useState(state.settings.speedMode)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  // Get available items for study
  const getAvailableItems = () => {
    let items = [...state.vocabItems]

    // Apply filters
    if (setup.filters.length > 0) {
      items = items.filter(item => {
        return setup.filters.every((filter: any) => {
          switch (filter.type) {
            case 'successRate':
              return item.successRate >= filter.min && item.successRate <= filter.max
            case 'inQueue':
              return item.inQueue >= filter.min
            case 'tag':
              return item.tag === filter.value
            default:
              return true
          }
        })
      })
    }

    // Apply sorting
    items.sort((a, b) => {
      switch (setup.sortBy) {
        case 'successRate':
          return a.successRate - b.successRate
        case 'inQueue':
          return b.inQueue - a.inQueue
        case 'keyword':
        default:
          return a.keyword.localeCompare(b.keyword)
      }
    })

    // Limit word count
    return items.slice(0, setup.wordCount)
  }

  const startSession = () => {
    const availableItems = getAvailableItems()
    if (availableItems.length === 0) {
      const hasData = state.vocabItems.length > 0
      alert(hasData
        ? 'No vocabulary items match your current filters. Please adjust your filters or add more items.'
        : 'No vocabulary items available for study. Please import some data first.'
      )
      return
    }

    const initialQueue = QueueService.createQueue(availableItems)
    setQueue(initialQueue)
    setCurrentIndex(0)
    setShowSetup(false)
    setSessionCompleted(false)

    // Generate first question
    generateQuestion(initialQueue, 0)
  }

  const generateQuestion = (currentQueue: QueueItem[], index: number) => {
    if (index >= currentQueue.length) return

    const item = currentQueue[index]
    const availableModules = state.modules.filter(m =>
      setup.selectedModules.length === 0 || setup.selectedModules.includes(m.id)
    )

    if (availableModules.length === 0) {
      alert('No modules available for question generation.')
      return
    }

    // For now, use the first available module
    const module = availableModules[0]
    let question: QuizQuestion

    switch (module.type) {
      case 'mcq':
        question = QueueService.generateMCQQuestion(item, state.vocabItems, module.distractors || 3)
        break
      case 'true-false':
        question = QueueService.generateTrueFalseQuestion(item)
        break
      case 'typing':
      default:
        question = QueueService.generateTypingQuestion(item)
        break
    }

    setCurrentQuestion(question)
    setUserAnswer('')
    setShowFeedback(false)
  }

  const handleAnswerSubmit = () => {
    if (!currentQuestion || !userAnswer.trim()) return

    const isCorrect = checkAnswer()
    setShowFeedback(true)

    // Process answer through queue service
    const result = QueueService.processAnswer(
      queue,
      queue[currentIndex],
      isCorrect,
      currentQuestion.type
    )

    // Update queue
    setQueue(result.updatedQueue)

    // Update item statistics
    const updatedItem = {
      ...currentQuestion.item,
      failed: isCorrect ? currentQuestion.item.failed : currentQuestion.item.failed + 1,
      passed1: isCorrect && (queue[currentIndex] as any).tempPassed1 === 0
        ? currentQuestion.item.passed1 + 1
        : currentQuestion.item.passed1,
      passed2: isCorrect && (queue[currentIndex] as any).tempPassed1 === 1
        ? currentQuestion.item.passed2 + 1
        : currentQuestion.item.passed2,
      successRate: 0, // Will be recalculated on commit
      lastDayPractice: new Date().toISOString().split('T')[0]
    }

    dispatch({
      type: 'UPDATE_VOCAB_ITEM',
      payload: { id: currentQuestion.item.id, updates: updatedItem }
    })

    // Check if session is completed
    if (result.completed) {
      setSessionCompleted(true)
    }
  }

  const checkAnswer = (): boolean => {
    switch (currentQuestion?.type) {
      case 'mcq':
        return userAnswer === currentQuestion.correctAnswer
      case 'true-false':
        return userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
      case 'typing':
      default:
        return userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase()
    }
  }

  const handleNext = () => {
    if (sessionCompleted) {
      // Commit session
      commitSession()
      return
    }

    if (currentIndex + 1 < queue.length) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      generateQuestion(queue, nextIndex)
    }
  }

  const commitSession = () => {
    // Calculate final statistics for all items
    queue.forEach(item => {
      const totalAttempts = item.failed + item.passed1 + item.passed2
      const finalSuccessRate = totalAttempts > 0
        ? (item.passed1 + item.passed2) / totalAttempts
        : 0

      dispatch({
        type: 'UPDATE_VOCAB_ITEM',
        payload: {
          id: item.id,
          updates: {
            failed: item.failed,
            passed1: item.passed1,
            passed2: item.passed2,
            successRate: finalSuccessRate,
            inQueue: item.inQueue + 1
          }
        }
      })
    })

    // End session
    setShowSetup(true)
    setQueue([])
    setCurrentIndex(0)
    setCurrentQuestion(null)
    setSessionCompleted(false)

    alert('Session completed! Statistics have been updated.')
  }

  const quitSession = () => {
    if (confirm('Are you sure you want to quit? Progress will not be saved.')) {
      // Update quit count for unfinished items
      queue.forEach(item => {
        if (item.tempPassed2 !== 1) {
          dispatch({
            type: 'UPDATE_VOCAB_ITEM',
            payload: {
              id: item.id,
              updates: { quitQueue: item.quitQueue + 1 }
            }
          })
        }
      })

      setShowSetup(true)
      setQueue([])
      setCurrentIndex(0)
      setCurrentQuestion(null)
      setSessionCompleted(false)
    }
  }

  // Handle browser tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (queue.length > 0 && !sessionCompleted) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [queue.length, sessionCompleted])

  if (showSetup) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Setup</h1>

          {/* Data Source Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Source
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  value={setup.projectId || ''}
                  onChange={(e) => setSetup({...setup, projectId: e.target.value || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project (optional)</option>
                  {state.projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                Or select tables directly below
              </div>
            </div>
          </div>

          {/* Table Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vocabulary Tables
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {state.vocabItems.length > 0 && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setup.tableIds.length > 0}
                    onChange={(e) => setSetup({
                      ...setup,
                      tableIds: e.target.checked ? ['all'] : []
                    })}
                    className="mr-2"
                  />
                  All Items ({state.vocabItems.length})
                </label>
              )}
            </div>
          </div>

          {/* Word Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Words: {setup.wordCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={setup.wordCount}
              onChange={(e) => setSetup({...setup, wordCount: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>

          {/* Module Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Modules
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {state.modules.map(module => (
                <label key={module.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setup.selectedModules.includes(module.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...setup.selectedModules, module.id]
                        : setup.selectedModules.filter(id => id !== module.id)
                      setSetup({...setup, selectedModules: updated})
                    }}
                    className="mr-2"
                  />
                  {module.name} ({module.type.toUpperCase()})
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={setup.tableIds.length === 0 || setup.selectedModules.length === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Play size={20} />
            Start Study Session ({setup.wordCount} words)
          </button>
        </div>
      </div>
    )
  }

  // Quiz Player
  if (sessionCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Completed!</h2>
          <p className="text-gray-600 mb-6">
            You've successfully completed all {queue.length} questions.
            Your progress has been saved.
          </p>
          <button
            onClick={commitSession}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Complete Session
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Queue Top Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Study Queue</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeywords(!showKeywords)}
              className="flex items-center gap-1 px-3 py-1 text-sm border rounded"
            >
              {showKeywords ? <EyeOff size={14} /> : <Eye size={14} />}
              {showKeywords ? 'Hide' : 'Show'} Keywords
            </button>
            <button
              onClick={() => setSpeedMode(!speedMode)}
              className={`flex items-center gap-1 px-3 py-1 text-sm border rounded ${
                speedMode ? 'bg-blue-100 border-blue-300' : ''
              }`}
            >
              <Settings size={14} />
              Speed Mode
            </button>
            <button
              onClick={quitSession}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
            >
              <AlertTriangle size={14} />
              Quit
            </button>
          </div>
        </div>

        {/* Queue Cards */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {queue.map((item, index) => (
            <div
              key={item.id}
              className={`flex-shrink-0 w-20 h-12 rounded flex items-center justify-center text-xs font-medium ${
                index === currentIndex
                  ? 'bg-blue-600 text-white'
                  : item.tempPassed2 === 1
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : item.tempFailed > 0
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
            >
              {showKeywords ? (
                <span className="truncate px-1">{item.keyword}</span>
              ) : (
                <span>#{index + 1}</span>
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 mt-2">
          Question {currentIndex + 1} of {queue.length} | Progress: {Math.round((currentIndex / queue.length) * 100)}%
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentQuestion.type === 'mcq' && 'Multiple Choice'}
            {currentQuestion.type === 'true-false' && 'True or False'}
            {currentQuestion.type === 'typing' && 'Type the Answer'}
          </h3>
          <p className="text-gray-600">Answer the question below</p>
        </div>

        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-900">{currentQuestion.question}</p>
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          {currentQuestion.type === 'mcq' ? (
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  disabled={showFeedback}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-blue-50 disabled:border-blue-300"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : currentQuestion.type === 'true-false' ? (
            <div className="flex gap-4">
              {['true', 'false'].map((option) => (
                <button
                  key={option}
                  onClick={() => setUserAnswer(option)}
                  disabled={showFeedback}
                  className="flex-1 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-blue-50 disabled:border-blue-300 capitalize"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !showFeedback && handleAnswerSubmit()}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={showFeedback}
            />
          )}
        </div>

        {/* Submit Button */}
        {!showFeedback && (
          <button
            onClick={handleAnswerSubmit}
            disabled={!userAnswer.trim() && currentQuestion.type !== 'mcq'}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className="space-y-4">
            <div className={`flex items-center p-4 rounded-lg ${
              checkAnswer()
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {checkAnswer() ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    checkAnswer() ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {checkAnswer() ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>

                {!checkAnswer() && (
                  <p className="text-sm text-green-700">
                    Correct answer: <strong>{currentQuestion.correctAnswer}</strong>
                  </p>
                )}

                {/* Full word info in default mode */}
                {!speedMode && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h4 className="font-medium text-gray-900 mb-2">{currentQuestion.item.keyword}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Definition:</strong> {currentQuestion.item.definition}</p>
                      {currentQuestion.item.example && (
                        <p><strong>Example:</strong> {currentQuestion.item.example}</p>
                      )}
                      {currentQuestion.item.pronunciation && (
                        <p><strong>Pronunciation:</strong> {currentQuestion.item.pronunciation}</p>
                      )}
                      <p><strong>Tag:</strong> {currentQuestion.item.tag || 'General'}</p>
                      <p><strong>Success Rate:</strong> {Math.round(currentQuestion.item.successRate * 100)}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {sessionCompleted ? (
                <>
                  <CheckCircle size={16} />
                  Complete Session
                </>
              ) : (
                <>
                  <ChevronRight size={16} />
                  Next Question
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
