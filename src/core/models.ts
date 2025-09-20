// Core data models for Vocab Queue Master

export type GradeLevel = 'G5'

export interface VocabItem {
  id: string
  term: string
  meaning: string
  example?: string
  tags?: string[]

  // Learning statistics
  passed1: number   // Passed1: correct answers at level 1 (first-time correct)
  passed2: number   // Passed2: correct answers at level 2 (second-time correct)
  failed: number    // Failed: incorrect answers

  lastReviewedAt?: number // epoch ms
  createdAt: number
  updatedAt: number
}

export interface Settings {
  halfLifeDays: number      // H, default 7 days
  guessBaseline: number     // default 0.5 (50% for random guessing)
  speedMode: boolean        // auto-advance toggle
  
  // Focus thresholds
  overdueDays: number       // default 7
  decayMin: number          // default baseline + 0.1
  srMin: number             // default 0.6
  
  // Urgency weights
  timeWeight: number        // default 0.5
  srWeight: number          // default 0.3
  decayWeight: number       // default 0.2
}

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: number
  lastLoginAt: number
  settings: Settings
}

export interface CloudState {
  items: VocabItem[]
  queues: Record<string, string[]>  // active session queues by project/list id
  backups?: Array<{ id: string; createdAt: number; size: number }>
}

export interface StudySession {
  id: string
  items: VocabItem[]
  currentIndex: number
  completed: boolean
  startedAt: number
  completedAt?: number
  quitCount: number
}

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'true-false' | 'typing'
  item: VocabItem
  options?: string[]  // for MCQ
  correctAnswer: string
  userAnswer?: string
  isCorrect?: boolean
  answeredAt?: number
}
