import { db } from '../lib/db'
import { VocabItem, StudySession } from '../core/models'

export class DBService {
  // Vocab Items
  static async getVocabItems(): Promise<VocabItem[]> {
    return db.items.toArray()
  }

  static async saveVocabItem(item: Omit<VocabItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Date.now()
    return db.items.add({
      ...item,
      createdAt: now,
      updatedAt: now,
      lastReviewedAt: 0,
      nextReviewDate: 0,
      mastery: 0,
      passed1: 0,
      passed2: 0,
      failed: 0
    })
  }

  // Study Sessions
  static async getStudySessions(limit = 50): Promise<StudySession[]> {
    return db.sessions
      .orderBy('startedAt')
      .reverse()
      .limit(limit)
      .toArray()
  }

  static async saveStudySession(session: Omit<StudySession, 'id'>): Promise<string> {
    return db.sessions.add({
      ...session,
      id: crypto.randomUUID()
    })
  }
}
