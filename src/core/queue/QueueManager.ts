import { VocabItem } from '../models'

type QueueItemState = {
  tempPassed1: number
  tempPassed2: number
  tempFailed: number
}

export class QueueManager {
  private queue: VocabItem[] = []
  private states: Map<string, QueueItemState> = new Map()
  private originalOrder: string[] = []

  constructor(items: VocabItem[]) {
    this.initializeQueue(items)
  }

  private initializeQueue(items: VocabItem[]) {
    this.queue = [...items]
    this.originalOrder = items.map(item => item.id)
    
    items.forEach(item => {
      this.states.set(item.id, {
        tempPassed1: 0,
        tempPassed2: 0,
        tempFailed: 0
      })
    })
  }

  processAnswer(itemId: string, isCorrect: boolean): { nextItem: VocabItem | null; isComplete: boolean } {
    const state = this.states.get(itemId)
    if (!state) return { nextItem: null, isComplete: true }

    const itemIndex = this.queue.findIndex(item => item.id === itemId)
    if (itemIndex === -1) return { nextItem: null, isComplete: true }

    if (isCorrect) {
      if (state.tempPassed1 === 0) {
        // First correct answer
        state.tempPassed1 = 1
        // Move to end of queue
        const [item] = this.queue.splice(itemIndex, 1)
        this.queue.push(item)
      } else {
        // Second correct answer
        state.tempPassed2 = 1
        // Remove from queue
        this.queue = this.queue.filter(item => item.id !== itemId)
      }
    } else {
      // Incorrect answer
      state.tempFailed++
      
      if (state.tempPassed1 === 1) {
        // Reset progress if they had previously passed once
        state.tempPassed1 = 0
      }
      
      // Reinsert at i+2 position (or end if not enough items)
      const newPosition = Math.min(itemIndex + 2, this.queue.length)
      const [item] = this.queue.splice(itemIndex, 1)
      this.queue.splice(newPosition, 0, item)
    }

    this.states.set(itemId, state)
    
    // Check if session is complete
    const isComplete = Array.from(this.states.values())
      .every(state => state.tempPassed2 === 1)

    return {
      nextItem: this.queue[0] || null,
      isComplete
    }
  }

  getCurrentState() {
    return {
      queue: [...this.queue],
      states: new Map(this.states),
      originalOrder: [...this.originalOrder]
    }
  }

  getProgress() {
    const states = Array.from(this.states.values())
    const total = states.length
    const completed = states.filter(s => s.tempPassed2 === 1).length
    
    return {
      completed,
      total,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
}
