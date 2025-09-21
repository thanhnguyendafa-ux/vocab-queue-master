import { QueueManager } from '../queue/QueueManager'
import { DBService } from '../../services/db-service'
import { VocabItem, Module, StudySession, QuizQuestion } from '../models'

export class StudySessionManager {
  private queueManager: QueueManager | null = null
  private currentSession: StudySession | null = null
  private startTime: number = 0

  async startSession(projectId: string, maxItems: number = 10) {
    // Load project and modules
    const project = await DBService.getProject(projectId)
    if (!project) throw new Error('Project not found')
    
    // Get items for the session
    const allItems = await DBService.getVocabItems(projectId)
    const sessionItems = this.selectSessionItems(allItems, maxItems)
    
    // Initialize queue
    this.queueManager = new QueueManager(sessionItems)
    
    // Create new session
    this.currentSession = {
      id: crypto.randomUUID(),
      projectId,
      items: sessionItems.map(item => item.id),
      originalItems: [...sessionItems],
      currentIndex: 0,
      completed: false,
      startedAt: Date.now(),
      quitCount: 0,
      totalQuestions: sessionItems.length,
      correctAnswers: 0,
      settings: {
        modules: project.modules,
        maxItems,
        focusMode: []
      }
    }
    
    this.startTime = Date.now()
    await DBService.saveStudySession(this.currentSession)
    
    return this.getNextQuestion()
  }

  private selectSessionItems(items: VocabItem[], maxItems: number): VocabItem[] {
    // Simple implementation - prioritize items that need review
    const sorted = [...items].sort((a, b) => {
      // Sort by last reviewed date (oldest first)
      const aTime = a.lastReviewedAt || 0
      const bTime = b.lastReviewedAt || 0
      return aTime - bTime
    })
    
    return sorted.slice(0, maxItems)
  }

  async processAnswer(questionId: string, isCorrect: boolean): Promise<{
    nextQuestion: QuizQuestion | null
    isComplete: boolean
    feedback: any
  }> {
    if (!this.queueManager || !this.currentSession) {
      throw new Error('No active session')
    }

    // Process answer in queue
    const { nextItem, isComplete } = this.queueManager.processAnswer(questionId, isCorrect)
    
    // Update session stats
    if (this.currentSession) {
      if (isCorrect) {
        this.currentSession.correctAnswers++
      }
      
      // Update current item stats in the database
      await DBService.updateVocabItem(questionId, {
        lastReviewedAt: Date.now(),
        ...(isCorrect 
          ? { passed1: 1 } // Simplified - should update based on temp state
          : { failed: 1 })
      })
    }

    // Get next question if session isn't complete
    let nextQuestion: QuizQuestion | null = null
    if (!isComplete && nextItem) {
      nextQuestion = this.createQuestion(nextItem)
    }

    // Update session in database
    if (this.currentSession) {
      this.currentSession.completed = isComplete
      if (isComplete) {
        this.currentSession.completedAt = Date.now()
      }
      await DBService.saveStudySession(this.currentSession)
    }

    return {
      nextQuestion,
      isComplete,
      feedback: {
        isCorrect,
        progress: this.queueManager.getProgress()
      }
    }
  }

  private createQuestion(item: VocabItem): QuizQuestion {
    // Simple implementation - always create MCQ for now
    return {
      id: item.id,
      type: 'mcq',
      item,
      options: this.generateOptions(item),
      correctAnswer: item.meaning,
      answeredAt: undefined,
      isCorrect: undefined,
      responseTime: undefined
    }
  }

  private generateOptions(correctItem: VocabItem): string[] {
    // In a real app, we would fetch other items to use as distractors
    // This is a simplified version
    const options = [correctItem.meaning]
    
    // Add some dummy options
    options.push('Incorrect Option 1')
    options.push('Incorrect Option 2')
    options.push('Incorrect Option 3')
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5)
  }

  async endSession() {
    if (!this.currentSession) return
    
    // Mark session as completed if not already
    if (!this.currentSession.completed) {
      this.currentSession.completed = true
      this.currentSession.completedAt = Date.now()
      await DBService.saveStudySession(this.currentSession)
    }
    
    // Clean up
    this.queueManager = null
    this.currentSession = null
  }

  getSessionStats() {
    if (!this.queueManager || !this.currentSession) {
      return null
    }
    
    const progress = this.queueManager.getProgress()
    const timeElapsed = Date.now() - this.startTime
    
    return {
      totalQuestions: this.currentSession.totalQuestions,
      correctAnswers: this.currentSession.correctAnswers,
      accuracy: this.currentSession.totalQuestions > 0
        ? Math.round((this.currentSession.correctAnswers / this.currentSession.totalQuestions) * 100)
        : 0,
      progress: progress.progress,
      timeElapsed,
      itemsRemaining: progress.total - progress.completed
    }
  }
}
