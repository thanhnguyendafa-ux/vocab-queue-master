import { calculateNextReview } from './srs'
import { DEFAULT_SETTINGS } from '../models'

describe('SRS Algorithm', () => {
  const testItem = {
    passed1: 3,
    passed2: 2,
    failed: 1,
    lastReviewedAt: Date.now() - 86400000,
    nextReviewDate: Date.now(),
    mastery: 0.6
  }
  
  test('correct answer increases mastery', () => {
    const result = calculateNextReview(testItem, true, DEFAULT_SETTINGS)
    expect(result.newMastery).toBeGreaterThan(testItem.mastery)
    expect(result.nextReview).toBeGreaterThan(Date.now())
  })
  
  test('incorrect answer decreases mastery', () => {
    const result = calculateNextReview(testItem, false, DEFAULT_SETTINGS)
    expect(result.newMastery).toBeLessThan(testItem.mastery)
  })
})
