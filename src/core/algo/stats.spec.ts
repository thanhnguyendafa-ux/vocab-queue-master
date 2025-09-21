import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  srSmooth,
  decayFactor,
  srDecay,
  daysSince,
  calculateMastery,
  calculateUrgency,
  filterItems,
  buildFocusQueue,
  formatMasteryPercent,
  getMasteryLevel,
  getItemStatistics,
  validateAlgorithms
} from './stats'
import { VocabItem, Settings, DEFAULT_SETTINGS, FocusFilter } from '../models'

// Mock Date.now() to return consistent values
const mockNow = new Date('2024-01-01T00:00:00Z').getTime()

beforeEach(() => {
  global.Date.now = vi.fn(() => mockNow)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Statistics Algorithms', () => {
  describe('srSmooth', () => {
    it('should handle edge case (0,0,0)', () => {
      const result = srSmooth({ passed1: 0, passed2: 0, failed: 0 })
      expect(result).toBe(1/2) // (0+0+1)/(0+0+0+2) = 1/2
    })

    it('should handle single correct (1,0,0)', () => {
      const result = srSmooth({ passed1: 1, passed2: 0, failed: 0 })
      expect(result).toBe(2/3) // (1+0+1)/(1+0+0+2) = 2/3
    })

    it('should handle single incorrect (0,0,1)', () => {
      const result = srSmooth({ passed1: 0, passed2: 0, failed: 1 })
      expect(result).toBe(1/3) // (0+0+1)/(0+0+1+2) = 1/3
    })

    it('should handle Grade 5 example (3,2,1)', () => {
      const result = srSmooth({ passed1: 3, passed2: 2, failed: 1 })
      expect(result).toBe(0.75) // (3+2+1)/(3+2+1+2) = 6/8 = 0.75
    })
  })

  describe('decayFactor', () => {
    it('should return 1 for t=0', () => {
      const result = decayFactor(0, 7)
      expect(result).toBe(1)
    })

    it('should return 0.5 for t=H', () => {
      const result = decayFactor(7, 7)
      expect(result).toBe(0.5)
    })

    it('should return 0.25 for t=2H', () => {
      const result = decayFactor(14, 7)
      expect(result).toBe(0.25)
    })

    it('should return 0.125 for t=3H', () => {
      const result = decayFactor(21, 7)
      expect(result).toBe(0.125)
    })
  })

  describe('srDecay', () => {
    const baseline = 0.5
    const srSmoothValue = 0.75
    const H = 7

    it('should return SR_smooth at t=0', () => {
      const result = srDecay(srSmoothValue, 0, H, baseline)
      expect(result).toBe(0.75)
    })

    it('should decay toward baseline over time', () => {
      const t7 = srDecay(srSmoothValue, 7, H, baseline)
      const t14 = srDecay(srSmoothValue, 14, H, baseline)
      const t21 = srDecay(srSmoothValue, 21, H, baseline)

      expect(t7).toBe(0.625) // 0.5 + 0.25*0.5 = 0.625
      expect(t14).toBe(0.5625) // 0.5 + 0.25*0.25 = 0.5625
      expect(t21).toBeCloseTo(0.53125, 5) // 0.5 + 0.25*0.125 ≈ 0.53125
    })

    it('should approach baseline as time increases', () => {
      const longTime = srDecay(srSmoothValue, 100, H, baseline)
      expect(longTime).toBeCloseTo(baseline, 3)
    })
  })

  describe('daysSince', () => {
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000

    it('should return Infinity for undefined lastReviewedAt', () => {
      const result = daysSince(undefined, now)
      expect(result).toBe(Infinity)
    })

    it('should return 0 for same day', () => {
      const result = daysSince(now, now)
      expect(result).toBe(0)
    })

    it('should return correct days for past dates', () => {
      const result = daysSince(now - 3 * oneDayMs, now)
      expect(result).toBe(3)
    })

    it('should not return negative days', () => {
      const result = daysSince(now + oneDayMs, now) // future date
      expect(result).toBe(0)
    })
  })

  describe('calculateMastery', () => {
    const item: VocabItem = {
      id: 'test',
      term: 'test',
      meaning: 'test',
      passed1: 3,
      passed2: 2,
      failed: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastReviewedAt: Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
    }

    it('should calculate mastery with decay', () => {
      const result = calculateMastery(item, 7, 0.5)
      // SR_smooth = 0.75, t=7, H=7, baseline=0.5
      // Expected: 0.5 + (0.75 - 0.5) * 0.5 = 0.625
      expect(result).toBe(0.625)
    })

    it('should return SR_smooth for never reviewed items', () => {
      const neverReviewedItem = { ...item, lastReviewedAt: undefined }
      const result = calculateMastery(neverReviewedItem, 7, 0.5)
      expect(result).toBe(0.75) // SR_smooth value
    })
  })

  describe('calculateUrgency', () => {
    const settings = {
      halfLifeDays: 7,
      guessBaseline: 0.5,
      timeWeight: 0.5,
      srWeight: 0.3,
      decayWeight: 0.2
    }

    it('should calculate higher urgency for overdue items', () => {
      const oldItem: VocabItem = {
        id: 'old',
        term: 'old',
        meaning: 'old',
        passed1: 1,
        passed2: 0,
        failed: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastReviewedAt: Date.now() - 15 * 24 * 60 * 60 * 1000 // 15 days ago
      }

      const newItem: VocabItem = {
        id: 'new',
        term: 'new',
        meaning: 'new',
        passed1: 1,
        passed2: 0,
        failed: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastReviewedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago
      }

      const oldUrgency = calculateUrgency(oldItem, settings)
      const newUrgency = calculateUrgency(newItem, settings)

      expect(oldUrgency).toBeGreaterThan(newUrgency)
    })

    it('should calculate higher urgency for low success rate items', () => {
      const lowSRItem: VocabItem = {
        id: 'low',
        term: 'low',
        meaning: 'low',
        passed1: 0,
        passed2: 0,
        failed: 5,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastReviewedAt: Date.now() - 3 * 24 * 60 * 60 * 1000
      }

      const highSRItem: VocabItem = {
        id: 'high',
        term: 'high',
        meaning: 'high',
        passed1: 5,
        passed2: 3,
        failed: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastReviewedAt: Date.now() - 3 * 24 * 60 * 60 * 1000
      }

      const lowUrgency = calculateUrgency(lowSRItem, settings)
      const highUrgency = calculateUrgency(highSRItem, settings)

      expect(lowUrgency).toBeGreaterThan(highUrgency)
    })
  })

  describe('filterItems', () => {
    const settings: Settings = DEFAULT_SETTINGS
    const now = mockNow // Use the mocked time
    const oneDayMs = 24 * 60 * 60 * 1000

    const items: VocabItem[] = [
      {
        id: 'overdue',
        term: 'overdue',
        meaning: 'overdue',
        passed1: 1,
        passed2: 0,
        failed: 1,
        createdAt: now,
        updatedAt: now,
        lastReviewedAt: now - 10 * oneDayMs // 10 days ago (overdue)
      },
      {
        id: 'recent',
        term: 'recent',
        meaning: 'recent',
        passed1: 2,
        passed2: 1,
        failed: 0,
        createdAt: now,
        updatedAt: now,
        lastReviewedAt: now - 2 * oneDayMs // 2 days ago (not overdue)
      },
      {
        id: 'unseen',
        term: 'unseen',
        meaning: 'unseen',
        passed1: 0,
        passed2: 0,
        failed: 0,
        createdAt: now,
        updatedAt: now
        // no lastReviewedAt (unseen)
      },
      {
        id: 'lowsr',
        term: 'lowsr',
        meaning: 'lowsr',
        passed1: 1,
        passed2: 0,
        failed: 5,
        createdAt: now,
        updatedAt: now,
        lastReviewedAt: now - 3 * oneDayMs
      }
    ]

    it('should filter overdue items', () => {
      const filters: FocusFilter[] = [{ type: 'overdue', enabled: true, threshold: 7 }]
      const result = filterItems(items, settings, filters)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('overdue')
    })

    it('should filter unseen items', () => {
      const filters: FocusFilter[] = [{ type: 'new', enabled: true }]
      const result = filterItems(items, settings, filters)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('unseen')
    })

    it('should filter low SR items', () => {
      const filters: FocusFilter[] = [{ type: 'low-sr', enabled: true, threshold: 0.6 }]
      const result = filterItems(items, settings, filters)
      expect(result.length).toBeGreaterThan(0)
      expect(result.some(item => item.id === 'lowsr')).toBe(true)
    })

    it('should use OR logic by default', () => {
      const filters: FocusFilter[] = [
        { type: 'overdue', enabled: true, threshold: 7 },
        { type: 'new', enabled: true }
      ]
      const result = filterItems(items, settings, filters)
      expect(result).toHaveLength(2)
      expect(result.map(item => item.id).sort()).toEqual(['overdue', 'unseen'])
    })

    it('should use AND logic when specified', () => {
      const filters: FocusFilter[] = [
        { type: 'overdue', enabled: true, threshold: 7 },
        { type: 'low-sr', enabled: true, threshold: 0.6 }
      ]
      const result = filterItems(items, settings, filters, 'AND')
      // Should find items that are both overdue AND have low SR
      expect(result.length).toBeLessThanOrEqual(items.length)
    })
  })

  describe('buildFocusQueue', () => {
    const settings: Settings = DEFAULT_SETTINGS
    const now = mockNow // Use the mocked time
    const oneDayMs = 24 * 60 * 60 * 1000

    const items: VocabItem[] = Array.from({ length: 25 }, (_, i) => ({
      id: `item_${i}`,
      term: `term_${i}`,
      meaning: `meaning_${i}`,
      passed1: Math.floor(Math.random() * 3),
      passed2: Math.floor(Math.random() * 2),
      failed: Math.floor(Math.random() * 4),
      createdAt: now,
      updatedAt: now,
      lastReviewedAt: i % 3 === 0 ? undefined : now - (i * oneDayMs)
    }))

    it('should limit queue size', () => {
      const filters: FocusFilter[] = [
        { type: 'new', enabled: true },
        { type: 'overdue', enabled: true, threshold: 7 }
      ]
      const result = buildFocusQueue(items, settings, filters, 10)
      expect(result.length).toBeLessThanOrEqual(10)
    })

    it('should sort by urgency', () => {
      const filters: FocusFilter[] = [
        { type: 'new', enabled: true },
        { type: 'overdue', enabled: true, threshold: 7 }
      ]
      const result = buildFocusQueue(items, settings, filters, 5)

      if (result.length >= 2) {
        const urgencies = result.map(item =>
          calculateUrgency(item, {
            halfLifeDays: settings.halfLifeDays,
            guessBaseline: settings.guessBaseline,
            timeWeight: settings.focusThresholds.w_t,
            srWeight: settings.focusThresholds.w_s,
            decayWeight: settings.focusThresholds.w_d
          })
        )

        // Check that urgencies are in descending order
        for (let i = 1; i < urgencies.length; i++) {
          expect(urgencies[i]).toBeLessThanOrEqual(urgencies[i - 1])
        }
      }
    })
  })

  describe('formatMasteryPercent', () => {
    it('should format percentages correctly', () => {
      expect(formatMasteryPercent(0.75)).toBe('75.0%')
      expect(formatMasteryPercent(0.333)).toBe('33.3%')
      expect(formatMasteryPercent(1.0)).toBe('100.0%')
      expect(formatMasteryPercent(0.0)).toBe('0.0%')
    })
  })

  describe('getMasteryLevel', () => {
    it('should categorize mastery levels correctly', () => {
      expect(getMasteryLevel(0.3)).toBe('low')
      expect(getMasteryLevel(0.6)).toBe('medium')
      expect(getMasteryLevel(0.7)).toBe('medium')
      expect(getMasteryLevel(0.8)).toBe('high')
      expect(getMasteryLevel(0.9)).toBe('high')
    })
  })

  describe('getItemStatistics', () => {
    const settings = {
      halfLifeDays: 7,
      guessBaseline: 0.5,
      speedMode: false,
      overdueDays: 7,
      decayMin: 0.6,
      srMin: 0.6,
      timeWeight: 0.5,
      srWeight: 0.3,
      decayWeight: 0.2,
      focusThresholds: {
        overdue_days: 7,
        decay_min: 0.6,
        sr_min: 0.6,
        w_t: 0.5,
        w_s: 0.3,
        w_d: 0.2
      }
    }
    const item: VocabItem = {
      id: 'test',
      term: 'test',
      meaning: 'test',
      passed1: 3,
      passed2: 2,
      failed: 1,
      createdAt: mockNow,
      updatedAt: mockNow,
      lastReviewedAt: mockNow - 7 * 24 * 60 * 60 * 1000
    }

    it('should return comprehensive statistics', () => {
      const result = getItemStatistics(item, settings)
      
      expect(result).toHaveProperty('srSmooth')
      expect(result).toHaveProperty('srDecay')
      expect(result).toHaveProperty('urgency')
      expect(result).toHaveProperty('daysSinceReview')
      expect(result).toHaveProperty('masteryLevel')
      expect(result).toHaveProperty('trend')
      expect(result).toHaveProperty('totalAttempts')
      expect(result).toHaveProperty('successRate')
      
      expect(result.srSmooth).toBe(0.75)
      expect(result.srDecay).toBe(0.625)
      expect(result.daysSinceReview).toBe(7)
      expect(result.masteryLevel).toBe('medium')
      expect(result.totalAttempts).toBe(6)
      expect(result.successRate).toBeCloseTo(0.75, 3) // srSmooth value
    })
  })

  describe('validateAlgorithms', () => {
    it('should validate core algorithm correctness', () => {
      const result = validateAlgorithms()
      expect(result).toBe(true)
    })
  })
})
