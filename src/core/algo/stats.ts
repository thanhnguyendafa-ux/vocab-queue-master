// Core statistics and algorithm functions for Vocab Queue Master

import { VocabItem } from '../models'

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
