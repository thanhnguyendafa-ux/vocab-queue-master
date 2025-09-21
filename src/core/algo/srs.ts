import { VocabItem, Settings } from '../models'

export function calculateNextReview(
  item: VocabItem,
  isCorrect: boolean,
  settings: Settings
): { nextReview: number; newMastery: number } {
  // SM-2 inspired algorithm
  const { halfLifeDays, guessBaseline } = settings
  
  const currentMastery = calculateMastery(item, halfLifeDays, guessBaseline)
  
  let newMastery = isCorrect 
    ? Math.min(currentMastery + 0.3, 1.0)
    : Math.max(currentMastery - 0.2, 0.1)
    
  // Convert mastery to days (half-life formula)
  const nextReviewDays = halfLifeDays * (-Math.log(newMastery) / Math.log(2))
  
  return {
    nextReview: Date.now() + nextReviewDays * 86400000,
    newMastery
  }
}

function calculateMastery(item: VocabItem, halfLifeDays: number, guessBaseline: number): number {
  // Existing mastery calculation logic
  return 0.7 // Placeholder
}
