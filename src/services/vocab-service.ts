import { DBService } from './db-service'
import { calculateNextReview } from '../core/algo/srs'
import { VocabItem } from '../core/models'

export class VocabService {
  static async importFromCSV(csvData: string): Promise<void> {
    const { parse } = await import('papaparse')
    const { data } = parse<Record<string, string>>(csvData, { header: true })
    
    const items = data.map(row => ({
      term: row.term || '',
      definition: row.definition || '',
      examples: row.examples ? row.examples.split('|') : [],
      tags: row.tags ? row.tags.split(',') : []
    }))
    
    await Promise.all(items.map(item => DBService.saveVocabItem(item)))
  }
  
  static async exportToCSV(): Promise<string> {
    const { unparse } = await import('papaparse')
    const items = await DBService.getVocabItems()
    return unparse(items)
  }
  
  static async updateAfterReview(
    itemId: string, 
    isCorrect: boolean,
    settings: { halfLifeDays: number; guessBaseline: number }
  ): Promise<void> {
    const item = await DBService.getVocabItem(itemId)
    if (!item) return
    
    const { nextReview, newMastery } = calculateNextReview(
      item,
      isCorrect,
      settings
    )
    
    await DBService.updateVocabItem(itemId, {
      lastReviewedAt: Date.now(),
      nextReviewDate: nextReview,
      mastery: newMastery,
      [isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed']: 
        item[isCorrect ? 'passed' + (Math.random() > 0.5 ? '1' : '2') : 'failed'] + 1
    })
  }
}
