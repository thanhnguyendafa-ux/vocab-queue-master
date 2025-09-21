import { calculateNextReview } from './srs'
import { DEFAULT_SETTINGS } from '../models'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('SRS Algorithm', () => {
  // Mock Date.now() to return consistent values
  const mockNow = new Date('2024-01-01T00:00:00Z').getTime()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockNow)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const testItem = {
    id: '1',
    term: 'test',
    meaning: 'test',
    passed1: 3,
    passed2: 2,
    failed: 1,
    lastReviewedAt: mockNow - 86400000, // 1 day ago
    nextReviewDate: mockNow + 86400000, // 1 day from now
    mastery: 0.6,
    createdAt: mockNow - 86400000 * 7, // 1 week ago
    updatedAt: mockNow - 86400000 * 7
  }

  it('correct answer increases mastery', () => {
    const result = calculateNextReview(testItem, true, DEFAULT_SETTINGS)
    expect(result.newMastery).toBeGreaterThan(testItem.mastery)
    expect(result.nextReview).toBeGreaterThanOrEqual(mockNow)
  })

  it('incorrect answer decreases mastery', () => {
    const result = calculateNextReview(testItem, false, DEFAULT_SETTINGS)
    expect(result.newMastery).toBeLessThan(testItem.mastery)
  })
})
