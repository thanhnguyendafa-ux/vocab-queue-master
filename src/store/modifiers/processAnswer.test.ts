import { processAnswer } from './processAnswer'
import { createQuizStore } from '../useQuizStore'
import { DEFAULT_SETTINGS } from '../../core/models'

describe('processAnswer modifier', () => {
  const initialState = {
    items: [{
      id: 'item1',
      term: 'Hello',
      meaning: 'Xin chào',
      passed1: 0,
      passed2: 0,
      failed: 0,
      lastReviewedAt: 0,
      nextReviewDate: 0,
      mastery: 0.5
    }],
    currentSession: {
      id: 'session1',
      projectId: 'project1',
      items: ['item1'],
      questions: [{
        id: 'q1',
        item: { id: 'item1' },
        type: 'mcq',
        correctAnswer: 'Xin chào'
      }],
      correctAnswers: 0,
      totalQuestions: 0
    },
    settings: DEFAULT_SETTINGS
  }

  test('correct answer updates state properly', () => {
    const store = createQuizStore(() => initialState)
    
    processAnswer(
      store.setState,
      store.getState,
      'q1',
      'Xin chào',
      true,
      3000
    )
    
    const newState = store.getState()
    expect(newState.items[0].passed1).toBe(1)
    expect(newState.currentSession.correctAnswers).toBe(1)
    expect(newState.items[0].mastery).toBeGreaterThan(0.5)
  })

  test('incorrect answer updates state properly', () => {
    const store = createQuizStore(() => initialState)
    
    processAnswer(
      store.setState,
      store.getState,
      'q1',
      'Wrong answer',
      false,
      5000
    )
    
    const newState = store.getState()
    expect(newState.items[0].failed).toBe(1)
    expect(newState.items[0].mastery).toBeLessThan(0.5)
  })
})
