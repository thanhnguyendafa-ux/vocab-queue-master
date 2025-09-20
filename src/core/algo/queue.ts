// Queue management algorithm for Vocab Queue Master

import { VocabItem, StudySession, QuizQuestion } from '../models'
import { calculateUrgency } from './stats'

/**
 * Process an answer and update the queue accordingly
 * Rules:
 * - Incorrect: insert back at i+2, reset passed1, increment failed
 * - First correct: passed1++, move to end
 * - Second correct: passed2++, remove from session
 */
export function processAnswer(
  item: VocabItem,
  isCorrect: boolean,
  queue: VocabItem[]
): { updatedItem: VocabItem; newQueue: VocabItem[] } {
  const updatedItem = { ...item }
  const newQueue = [...queue]
  const currentIndex = newQueue.findIndex(q => q.id === item.id)
  
  if (currentIndex === -1) {
    throw new Error('Item not found in queue')
  }
  
  // Remove item from current position
  newQueue.splice(currentIndex, 1)
  
  if (!isCorrect) {
    // Incorrect answer: reset passed1, increment failed, insert at i+2
    updatedItem.passed1 = 0
    updatedItem.failed += 1
    updatedItem.lastReviewedAt = Date.now()
    updatedItem.updatedAt = Date.now()
    
    const insertIndex = Math.min(currentIndex + 2, newQueue.length)
    newQueue.splice(insertIndex, 0, updatedItem)
  } else {
    // Correct answer
    updatedItem.lastReviewedAt = Date.now()
    updatedItem.updatedAt = Date.now()
    
    if (updatedItem.passed1 === 0) {
      // First-time correct: increment passed1, move to end
      updatedItem.passed1 = 1
      newQueue.push(updatedItem)
    } else {
      // Second-time correct: increment passed2, remove from session
      updatedItem.passed2 += 1
      // Item is not added back to queue (removed from session)
    }
  }
  
  return { updatedItem, newQueue }
}

/**
 * Check if session is complete
 * Session ends when all original items have reached passed2 >= 1
 */
export function isSessionComplete(
  originalItems: VocabItem[],
  currentQueue: VocabItem[],
  completedItems: VocabItem[]
): boolean {
  // Session is complete when queue is empty (all items reached passed2)
  return currentQueue.length === 0
}

/**
 * Create initial queue from vocabulary items
 * Sorts by urgency (most urgent first)
 */
export function createInitialQueue(
  items: VocabItem[],
  urgencyCalculator?: (item: VocabItem) => number
): VocabItem[] {
  if (!urgencyCalculator) {
    // Simple shuffle if no urgency calculator provided
    return [...items].sort(() => Math.random() - 0.5)
  }
  
  return [...items].sort((a, b) => urgencyCalculator(b) - urgencyCalculator(a))
}

/**
 * Get session progress information
 */
export function getSessionProgress(
  originalItems: VocabItem[],
  currentQueue: VocabItem[],
  completedItems: VocabItem[]
): {
  total: number
  completed: number
  remaining: number
  progress: number
  itemsAtLevel1: number
  itemsAtLevel2: number
} {
  const total = originalItems.length
  const remaining = currentQueue.length
  const completed = total - remaining
  const progress = total > 0 ? (completed / total) * 100 : 0
  
  // Count items at different levels
  const itemsAtLevel1 = currentQueue.filter(item => item.passed1 > 0).length
  const itemsAtLevel2 = completedItems.filter(item => item.passed2 > 0).length
  
  return { 
    total, 
    completed, 
    remaining, 
    progress, 
    itemsAtLevel1, 
    itemsAtLevel2 
  }
}

/**
 * Save queue state for resuming later
 */
export function saveQueueState(
  sessionId: string,
  queue: VocabItem[],
  completedItems: VocabItem[],
  quitCount: number,
  additionalData?: any
): void {
  const state = {
    sessionId,
    queue: queue.map(item => ({ ...item })), // deep copy
    completedItems: completedItems.map(item => ({ ...item })), // deep copy
    quitCount: quitCount + 1,
    savedAt: Date.now(),
    ...additionalData
  }
  
  localStorage.setItem(`queue_state_${sessionId}`, JSON.stringify(state))
}

/**
 * Load saved queue state
 */
export function loadQueueState(sessionId: string): {
  queue: VocabItem[]
  completedItems: VocabItem[]
  quitCount: number
  savedAt: number
  [key: string]: any
} | null {
  const saved = localStorage.getItem(`queue_state_${sessionId}`)
  if (!saved) return null
  
  try {
    return JSON.parse(saved)
  } catch {
    return null
  }
}

/**
 * Clear saved queue state
 */
export function clearQueueState(sessionId: string): void {
  localStorage.removeItem(`queue_state_${sessionId}`)
}

/**
 * Get next item from queue
 */
export function getNextItem(queue: VocabItem[]): VocabItem | null {
  return queue.length > 0 ? queue[0] : null
}

/**
 * Calculate session statistics
 */
export function calculateSessionStats(
  session: StudySession,
  questions: QuizQuestion[] = []
): {
  accuracy: number
  averageResponseTime: number
  totalQuestions: number
  correctAnswers: number
  streakCurrent: number
  streakBest: number
  timeSpent: number
  questionsPerMinute: number
} {
  const totalQuestions = session.totalQuestions
  const correctAnswers = session.correctAnswers
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  
  // Calculate response times
  const responseTimes = questions
    .filter(q => q.responseTime && q.responseTime > 0)
    .map(q => q.responseTime!)
  
  const averageResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0
  
  // Calculate streaks
  let currentStreak = 0
  let bestStreak = 0
  let tempStreak = 0
  
  questions.forEach(q => {
    if (q.isCorrect) {
      tempStreak++
      bestStreak = Math.max(bestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  })
  
  // Current streak is the streak at the end
  for (let i = questions.length - 1; i >= 0; i--) {
    if (questions[i].isCorrect) {
      currentStreak++
    } else {
      break
    }
  }
  
  const timeSpent = Date.now() - session.startedAt
  const questionsPerMinute = timeSpent > 0 ? (totalQuestions / (timeSpent / 60000)) : 0
  
  return {
    accuracy,
    averageResponseTime,
    totalQuestions,
    correctAnswers,
    streakCurrent: currentStreak,
    streakBest: bestStreak,
    timeSpent,
    questionsPerMinute
  }
}

/**
 * Validate queue state integrity
 */
export function validateQueueState(
  originalItems: VocabItem[],
  currentQueue: VocabItem[],
  completedItems: VocabItem[]
): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Check that all items are accounted for
  const allCurrentIds = new Set([
    ...currentQueue.map(item => item.id),
    ...completedItems.map(item => item.id)
  ])
  
  const originalIds = new Set(originalItems.map(item => item.id))
  
  // Check for missing items
  originalIds.forEach(id => {
    if (!allCurrentIds.has(id)) {
      errors.push(`Missing item: ${id}`)
    }
  })
  
  // Check for extra items
  allCurrentIds.forEach(id => {
    if (!originalIds.has(id)) {
      errors.push(`Extra item found: ${id}`)
    }
  })
  
  // Validate completed items have passed2 > 0
  completedItems.forEach(item => {
    if (item.passed2 === 0) {
      errors.push(`Completed item ${item.id} has passed2 = 0`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Reorder queue based on priority/urgency
 */
export function reorderQueue(
  queue: VocabItem[],
  urgencyCalculator: (item: VocabItem) => number,
  preserveFirstN: number = 3
): VocabItem[] {
  if (queue.length <= preserveFirstN) {
    return [...queue]
  }
  
  // Keep first N items in place, reorder the rest
  const preserved = queue.slice(0, preserveFirstN)
  const toReorder = queue.slice(preserveFirstN)
  
  const reordered = toReorder.sort((a, b) => 
    urgencyCalculator(b) - urgencyCalculator(a)
  )
  
  return [...preserved, ...reordered]
}

/**
 * Get queue insights for debugging/analytics
 */
export function getQueueInsights(
  queue: VocabItem[],
  completedItems: VocabItem[]
): {
  queueStats: {
    totalItems: number
    level0Items: number // never correct
    level1Items: number // passed1 > 0
    avgFailed: number
    avgPassed1: number
  }
  completedStats: {
    totalCompleted: number
    avgPassed2: number
    avgTotalAttempts: number
  }
  distribution: {
    byTag: Record<string, number>
    byMasteryLevel: Record<string, number>
  }
} {
  const queueStats = {
    totalItems: queue.length,
    level0Items: queue.filter(item => item.passed1 === 0).length,
    level1Items: queue.filter(item => item.passed1 > 0).length,
    avgFailed: queue.length > 0 
      ? queue.reduce((sum, item) => sum + item.failed, 0) / queue.length 
      : 0,
    avgPassed1: queue.length > 0 
      ? queue.reduce((sum, item) => sum + item.passed1, 0) / queue.length 
      : 0
  }
  
  const completedStats = {
    totalCompleted: completedItems.length,
    avgPassed2: completedItems.length > 0 
      ? completedItems.reduce((sum, item) => sum + item.passed2, 0) / completedItems.length 
      : 0,
    avgTotalAttempts: completedItems.length > 0 
      ? completedItems.reduce((sum, item) => sum + item.passed1 + item.passed2 + item.failed, 0) / completedItems.length 
      : 0
  }
  
  // Distribution analysis
  const byTag: Record<string, number> = {}
  const byMasteryLevel: Record<string, number> = { low: 0, medium: 0, high: 0 }
  
  const allItems = [...queue, ...completedItems]
  allItems.forEach(item => {
    // Tag distribution
    if (item.tags) {
      item.tags.forEach(tag => {
        byTag[tag] = (byTag[tag] || 0) + 1
      })
    }
    
    // Mastery level distribution (simplified)
    const totalAttempts = item.passed1 + item.passed2 + item.failed
    const successRate = totalAttempts > 0 ? (item.passed1 + item.passed2) / totalAttempts : 0
    
    if (successRate < 0.4) byMasteryLevel.low++
    else if (successRate < 0.7) byMasteryLevel.medium++
    else byMasteryLevel.high++
  })
  
  return {
    queueStats,
    completedStats,
    distribution: { byTag, byMasteryLevel }
  }
}

/**
 * Handle session interruption (quit/pause)
 */
export function handleSessionInterruption(
  session: StudySession,
  currentQueue: VocabItem[],
  completedItems: VocabItem[],
  reason: 'quit' | 'pause' | 'error' = 'quit'
): {
  updatedSession: StudySession
  shouldSave: boolean
  resumable: boolean
} {
  const updatedSession: StudySession = {
    ...session,
    quitCount: session.quitCount + 1,
    updatedAt: Date.now()
  }
  
  const shouldSave = currentQueue.length > 0 // only save if there's progress to resume
  const resumable = reason !== 'error' && currentQueue.length > 0
  
  if (shouldSave) {
    saveQueueState(session.id, currentQueue, completedItems, session.quitCount, {
      reason,
      interruptedAt: Date.now()
    })
  }
  
  return {
    updatedSession,
    shouldSave,
    resumable
  }
}
