import Dexie from 'dexie'

interface VocabDB {
  items: Dexie.Table<VocabItem, string>
  sessions: Dexie.Table<StudySession, string>
}

class AppDB extends Dexie implements VocabDB {
  items!: Dexie.Table<VocabItem, string>
  sessions!: Dexie.Table<StudySession, string>

  constructor() {
    super('VocabDB')
    this.version(1).stores({
      items: 'id, nextReviewDate',
      sessions: 'id, startedAt'
    })
  }
}

export const db = new AppDB()
