import { calculateNextReview } from '../../core/algo/srs'
import { QuizQuestion, VocabItem } from '../../core/models'
import { StoreApi } from 'zustand'
import { QuizStore } from '../useQuizStore'

export function processAnswer(
  set: StoreApi<QuizStore>['setState'],
  get: StoreApi<QuizStore>['getState'],
  questionId: string,
  userAnswer: string,
  isCorrect: boolean,
  responseTime: number
) {
  const { currentSession, items, settings } = get()
  
  if (!currentSession) return
  
  // Find the question and corresponding vocab item
  const question = currentSession.questions.find(q => q.id === questionId)
  const vocabItem = items.find(item => item.id === question?.item.id)
  
  if (!question || !vocabItem) return
  
  // Apply SRS algorithm
  const { nextReview, newMastery } = calculateNextReview(
    vocabItem,
    isCorrect,
    settings
  )
  
  // Update state
  set({
    items: items.map(item => 
      item.id === vocabItem.id
        ? {
            ...item,
            [isCorrect ? 'passed' + question.type : 'failed']: 
              item[isCorrect ? 'passed' + question.type : 'failed'] + 1,
            lastReviewedAt: Date.now(),
            nextReviewDate: nextReview,
            mastery: newMastery
          }
        : item
    ),
    currentSession: {
      ...currentSession,
      questions: currentSession.questions.map(q => 
        q.id === questionId
          ? {
              ...q,
              userAnswer,
              isCorrect,
              answeredAt: Date.now(),
              responseTime
            }
          : q
      ),
      [isCorrect ? 'correctAnswers' : 'incorrectAnswers']: 
        currentSession[isCorrect ? 'correctAnswers' : 'incorrectAnswers'] + 1,
      totalQuestions: currentSession.totalQuestions + 1
    }
  })
}
