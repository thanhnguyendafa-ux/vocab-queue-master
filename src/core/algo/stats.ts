// Core statistics and algorithm functions for Vocab Queue Master

import { VocabItem, Settings, FocusFilter, ItemStats } from '../models'

/**
 * Calculate smoothed success rate (SR_smooth)
 * Formula: (Passed1 + Passed2 + 1) / (Passed1 + Passed2 + Failed + 2)
 * The +1 and +2 provide smoothing to reduce bias with sparse data
 */
export function srSmooth(stats: { passed1: number; passed2: number; failed: number }): number {
  const { passed1, passed2, failed } = stats
  return (passed1 + passed2 + 1) / (passed1 + passed2 + failed + 2)
}

/**
 * Calculate decay factor for elapsed time
 * Formula: 0.5^(t / H)
 * @param tDays - days elapsed since last review
 * @param halfLifeDays - half-life in days (H)
 */
export function decayFactor(tDays: number, halfLifeDays: number): number {
  return Math.pow(0.5, tDays / halfLifeDays)
}

/**
 * Calculate mastery after applying time decay
 * Formula: baseline + (SR_smooth - baseline) * d(t)
 * @param srSmoothValue - smoothed success rate
 * @param tDays - days elapsed since last review
 * @param halfLifeDays - half-life in days
 * @param baseline - guessing baseline (default 0.5)
 */
export function srDecay(
  srSmoothValue: number, 
  tDays: number, 
  halfLifeDays: number, 
  baseline = 0.5
): number {
  const decay = decayFactor(tDays, halfLifeDays)
  return baseline + (srSmoothValue - baseline) * decay
}

/**
 * Calculate days since last review
 * @param lastReviewedAt - timestamp in milliseconds
 * @param now - current timestamp (default: Date.now())
 * @returns days elapsed (Infinity if never reviewed)
 */
export function daysSince(lastReviewedAt?: number, now = Date.now()): number {
  if (!lastReviewedAt) return Infinity // unseen items should be prioritized
  const oneDay = 24 * 60 * 60 * 1000
  return Math.max(0, Math.floor((now - lastReviewedAt) / oneDay))
}

/**
 * Calculate current mastery level for a vocabulary item
 * Combines SR_smooth with time decay
 */
export function calculateMastery(
  item: VocabItem, 
  halfLifeDays: number, 
  baseline: number
): number {
  const smooth = srSmooth({
    passed1: item.passed1,
    passed2: item.passed2,
    failed: item.failed
  })
  
  const days = daysSince(item.lastReviewedAt)
  
  // If never reviewed, return the smoothed rate
  if (!isFinite(days)) {
    return smooth
  }
  
  return srDecay(smooth, days, halfLifeDays, baseline)
}

/**
 * Calculate urgency score for prioritizing items
 * Higher score = more urgent to review
 */
export function calculateUrgency(
  item: VocabItem,
  settings: {
    halfLifeDays: number
    guessBaseline: number
    timeWeight: number
    srWeight: number
    decayWeight: number
  },
  maxDays = 30
): number {
  const t = daysSince(item.lastReviewedAt)
  const s = srSmooth(item)
  const d = calculateMastery(item, settings.halfLifeDays, settings.guessBaseline)
  
  // Normalize features (0-1 range)
  const timeNorm = Math.max(0, Math.min(1, t / maxDays))
  const srNorm = Math.max(0, Math.min(1, (0.7 - s) / 0.7)) // higher when SR is low
  const decayNorm = Math.max(0, Math.min(1, (d - settings.guessBaseline) / (1 - settings.guessBaseline)))
  
  // Weighted combination
  return (
    settings.timeWeight * timeNorm +
    settings.srWeight * srNorm +
    settings.decayWeight * (1 - decayNorm) // higher urgency when decay is low
  )
}

/**
 * Format mastery percentage for display
 */
export function formatMasteryPercent(mastery: number): string {
  return `${(mastery * 100).toFixed(1)}%`
}

/**
 * Get mastery level category
 */
export function getMasteryLevel(mastery: number): 'low' | 'medium' | 'high' {
  if (mastery < 0.6) return 'low'
  if (mastery < 0.8) return 'medium'
  return 'high'
}

/**
 * Filter vocabulary items based on criteria and focus filters
 */
export function filterItems(
  items: VocabItem[],
  settings: Settings,
  filters: FocusFilter[],
  logic: 'AND' | 'OR' = 'OR'
): VocabItem[] {
  if (filters.length === 0) return items

  return items.filter(item => {
    if (logic === 'AND') {
      return filters.every(filter => matchesFilter(item, filter, settings))
    } else {
      return filters.some(filter => matchesFilter(item, filter, settings))
    }
  })
}

/**
 * Check if an item matches a specific filter
 */
function matchesFilter(item: VocabItem, filter: FocusFilter, settings: Settings): boolean {
  if (!filter.enabled) return false

  const days = daysSince(item.lastReviewedAt)
  const mastery = calculateMastery(item, settings.halfLifeDays, settings.guessBaseline)
  const successRate = srSmooth(item)

  switch (filter.type) {
    case 'overdue':
      return isFinite(days) && days >= (filter.threshold || settings.overdueDays)

    case 'low-sr':
      return successRate <= (filter.threshold || settings.srMin)

    case 'high-decay':
      return mastery <= (filter.threshold || settings.decayMin)

    case 'new':
      return item.passed1 === 0 && item.passed2 === 0

    case 'failed':
      return item.failed > 0

    default:
      return false
  }
}

/**
 * Build a focused study queue based on filters and settings
 */
export function buildFocusQueue(
  items: VocabItem[],
  settings: Settings,
  filters: FocusFilter[],
  maxItems = 20
): VocabItem[] {
  const filteredItems = filterItems(items, settings, filters, 'OR')

  if (filteredItems.length === 0) return []

  // Sort by urgency (most urgent first)
  const sortedItems = filteredItems.sort((a, b) => {
    const urgencyA = calculateUrgency(a, {
      halfLifeDays: settings.halfLifeDays,
      guessBaseline: settings.guessBaseline,
      timeWeight: settings.focusThresholds.w_t,
      srWeight: settings.focusThresholds.w_s,
      decayWeight: settings.focusThresholds.w_d
    })

    const urgencyB = calculateUrgency(b, {
      halfLifeDays: settings.halfLifeDays,
      guessBaseline: settings.guessBaseline,
      timeWeight: settings.focusThresholds.w_t,
      srWeight: settings.focusThresholds.w_s,
      decayWeight: settings.focusThresholds.w_d
    })

    return urgencyB - urgencyA
  })

  return sortedItems.slice(0, maxItems)
}

/**
 * Get detailed statistics for a vocabulary item
 */
export function getItemStatistics(item: VocabItem, settings: Settings): ItemStats {
  const mastery = calculateMastery(item, settings.halfLifeDays, settings.guessBaseline)
  const successRate = srSmooth(item)
  const days = daysSince(item.lastReviewedAt)
  const totalAttempts = item.passed1 + item.passed2 + item.failed

  // Calculate trend (simplified - could be more sophisticated)
  const trend = totalAttempts > 0
    ? (item.passed1 + item.passed2) / totalAttempts
    : 0.5 // neutral trend for new items

  return {
    mastery,
    successRate,
    srSmooth: successRate, // Add srSmooth for compatibility
    srDecay: srDecay(successRate, days, settings.halfLifeDays, settings.guessBaseline), // Add srDecay
    decay: mastery, // Simplified - in full implementation, this would be separate
    urgency: calculateUrgency(item, {
      halfLifeDays: settings.halfLifeDays,
      guessBaseline: settings.guessBaseline,
      timeWeight: settings.focusThresholds.w_t,
      srWeight: settings.focusThresholds.w_s,
      decayWeight: settings.focusThresholds.w_d
    }),
    totalAttempts,
    daysSinceLastReview: days,
    daysSinceReview: days, // Add for compatibility
    isOverdue: days >= settings.overdueDays,
    masteryLevel: getMasteryLevel(mastery), // Add masteryLevel
    trend // Add trend property
  }
}

/**
 * Validate core algorithm correctness
 * This function checks that all algorithms are working correctly
 */
export function validateAlgorithms(): boolean {
  // Test srSmooth function
  const smoothTest1 = srSmooth({ passed1: 0, passed2: 0, failed: 0 })
  const smoothTest2 = srSmooth({ passed1: 1, passed2: 0, failed: 0 })
  const smoothTest3 = srSmooth({ passed1: 0, passed2: 0, failed: 1 })

  if (smoothTest1 !== 0.5 || smoothTest2 !== (2/3) || smoothTest3 !== (1/3)) {
    return false
  }

  // Test decayFactor function
  const decayTest1 = decayFactor(0, 7)
  const decayTest2 = decayFactor(7, 7)
  const decayTest3 = decayFactor(14, 7)

  if (decayTest1 !== 1 || decayTest2 !== 0.5 || decayTest3 !== 0.25) {
    return false
  }

  // Test basic functionality
  return true
}
