import { processAnswer } from '../../core/algo/queue'
import { useQuizStore } from '../useQuizStore'
import { DEFAULT_SETTINGS } from '../../core/models'
import { calculateMastery } from '../../core/algo/stats'
import { describe, it, expect, beforeAll, vi } from 'vitest'

describe('processAnswer modifier', () => {
  // Mock Date.now() to return consistent values
  const mockNow = new Date('2024-01-01T00:00:00Z').getTime()

  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockNow)

    useQuizStore.setState({
      items: [{
        id: 'item1',
        term: 'Hello',
        meaning: 'Xin chào',
        passed1: 0,
        passed2: 0,
        failed: 0,
        lastReviewedAt: mockNow - 86400000, // 1 day ago
        createdAt: mockNow - 86400000 * 7,
        updatedAt: mockNow - 86400000 * 7
      }],
      settings: DEFAULT_SETTINGS
    })
  })

  it('correct answer updates state properly', () => {
    const store = useQuizStore.getState()

    // Test the processAnswer function directly
    const currentItem = store.items[0]
    const queue = [currentItem]

    const result = processAnswer(currentItem, true, queue)

    // Check that the item was updated correctly
    expect(result.updatedItem.passed1).toBe(1)
    expect(result.updatedItem.lastReviewedAt).toBeGreaterThan(0)
    expect(result.newQueue.length).toBe(1) // Should be added to end
  })

  it('incorrect answer updates state properly', () => {
    const store = useQuizStore.getState()

    const currentItem = store.items[0]
    const queue = [currentItem]

    const result = processAnswer(currentItem, false, queue)

    // Check that the item was updated correctly
    expect(result.updatedItem.failed).toBe(1)
    expect(result.updatedItem.passed1).toBe(0)
    expect(result.newQueue.length).toBe(1) // Should be inserted at position 2
    // Check that the failed item was moved to position 2 (index 0)
    expect(result.newQueue[0].id).toBe('item1')
  })
})
