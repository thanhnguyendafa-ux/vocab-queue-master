import { VocabItem } from '../contexts/AppContext'

export interface QueueItem extends VocabItem {
  tempPassed1: number
  tempPassed2: number
  tempFailed: number
  currentIndex: number
}

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'true-false' | 'typing'
  item: VocabItem
  question: string
  correctAnswer: string
  options?: string[] // for MCQ
  userAnswer?: string
  isCorrect?: boolean
}

export class QueueService {
  // Create initial queue from selected items
  static createQueue(items: VocabItem[]): QueueItem[] {
    return items.map((item, index) => ({
      ...item,
      tempPassed1: 0,
      tempPassed2: 0,
      tempFailed: 0,
      currentIndex: index
    }))
  }

  // Process user answer and update queue
  static processAnswer(
    queue: QueueItem[],
    currentItem: QueueItem,
    isCorrect: boolean,
    questionType: 'mcq' | 'true-false' | 'typing'
  ): {
    updatedQueue: QueueItem[]
    nextIndex: number
    completed: boolean
  } {
    let updatedQueue = [...queue]
    let nextIndex = 0

    if (isCorrect) {
      // Correct answer
      if (questionType === 'typing') {
        // For typing questions, check if this is first or second correct
        if (currentItem.tempPassed1 === 1) {
          // Second correct - mark as passed2 and remove from queue
          updatedQueue = updatedQueue.filter(item => item.id !== currentItem.id)
          // Find the new current index (next item in original order)
          const remainingItems = updatedQueue.filter(item => item.currentIndex > currentItem.currentIndex)
          nextIndex = remainingItems.length > 0 ? Math.min(...remainingItems.map(item => item.currentIndex)) : 0
        } else {
          // First correct - mark as passed1 and move to end
          updatedQueue = updatedQueue.filter(item => item.id !== currentItem.id)
          updatedQueue.push({
            ...currentItem,
            tempPassed1: 1,
            currentIndex: Math.max(...updatedQueue.map(item => item.currentIndex), 0) + 1
          })
          nextIndex = Math.min(...updatedQueue.map(item => item.currentIndex))
        }
      } else {
        // For MCQ/True-False, single correct is enough
        updatedQueue = updatedQueue.filter(item => item.id !== currentItem.id)
        const remainingItems = updatedQueue.filter(item => item.currentIndex > currentItem.currentIndex)
        nextIndex = remainingItems.length > 0 ? Math.min(...remainingItems.map(item => item.currentIndex)) : 0
      }
    } else {
      // Incorrect answer
      const updatedItem = {
        ...currentItem,
        tempPassed1: 0, // Reset tempPassed1
        tempFailed: currentItem.tempFailed + 1
      }

      // Remove current item
      updatedQueue = updatedQueue.filter(item => item.id !== currentItem.id)

      // Find insertion point (position i+2 from original position)
      const originalIndex = currentItem.currentIndex
      const insertIndex = Math.min(originalIndex + 2, updatedQueue.length)

      // Insert at the calculated position
      updatedQueue.splice(insertIndex, 0, {
        ...updatedItem,
        currentIndex: insertIndex
      })

      // Update indices for items after insertion point
      for (let i = insertIndex + 1; i < updatedQueue.length; i++) {
        updatedQueue[i].currentIndex = i
      }

      nextIndex = insertIndex
    }

    // Check if session is completed
    const completed = updatedQueue.every(item => item.tempPassed2 === 1)

    return {
      updatedQueue,
      nextIndex,
      completed
    }
  }

  // Generate MCQ question
  static generateMCQQuestion(
    item: VocabItem,
    allItems: VocabItem[],
    distractors: number = 3
  ): QuizQuestion {
    const correctAnswer = item.keyword
    const question = item.definition

    // Generate distractors (other keywords)
    const otherItems = allItems.filter(i => i.id !== item.id)
    const distractorOptions = otherItems
      .sort(() => Math.random() - 0.5)
      .slice(0, distractors)
      .map(i => i.keyword)

    // Combine correct answer with distractors
    const options = [correctAnswer, ...distractorOptions]
      .sort(() => Math.random() - 0.5) // Shuffle

    return {
      id: `mcq-${item.id}`,
      type: 'mcq',
      item,
      question,
      correctAnswer,
      options
    }
  }

  // Generate True/False question
  static generateTrueFalseQuestion(item: VocabItem): QuizQuestion {
    const correctAnswer = item.keyword
    const question = `Is the definition "${item.definition}" correct for the word "${correctAnswer}"?`

    return {
      id: `tf-${item.id}`,
      type: 'true-false',
      item,
      question,
      correctAnswer: 'true',
      options: ['true', 'false']
    }
  }

  // Generate Typing question
  static generateTypingQuestion(item: VocabItem): QuizQuestion {
    const correctAnswer = item.keyword
    const question = item.definition

    return {
      id: `typing-${item.id}`,
      type: 'typing',
      item,
      question,
      correctAnswer
    }
  }

  // Calculate urgency score for item prioritization
  static calculateUrgency(item: VocabItem): number {
    const now = Date.now()
    const daysSincePractice = item.lastDayPractice
      ? Math.floor((now - new Date(item.lastDayPractice).getTime()) / (24 * 60 * 60 * 1000))
      : 30 // Default to high urgency if never practiced

    // Factors affecting urgency:
    // 1. Time since last practice (older = more urgent)
    // 2. Success rate (lower = more urgent)
    // 3. Failed count (higher = more urgent)

    const timeUrgency = Math.min(daysSincePractice / 30, 1) // Normalize to 0-1
    const srUrgency = Math.max(0, (1 - item.successRate)) // Lower SR = higher urgency
    const failUrgency = Math.min(item.failed / 10, 1) // Normalize failed count

    // Weighted combination
    return (timeUrgency * 0.4) + (srUrgency * 0.4) + (failUrgency * 0.2)
  }

  // Sort items by urgency (most urgent first)
  static sortByUrgency(items: VocabItem[]): VocabItem[] {
    return items.sort((a, b) => this.calculateUrgency(b) - this.calculateUrgency(a))
  }
}
