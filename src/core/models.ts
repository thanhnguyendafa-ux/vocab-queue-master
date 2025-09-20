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
  
  // Focus thresholds object
  focusThresholds: {
    overdue_days: number
    decay_min: number
    sr_min: number
    w_t: number
    w_s: number
    w_d: number
  }
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
  projectId: string
  items: VocabItem[]
  originalItems: VocabItem[]
  currentIndex: number
  completed: boolean
  startedAt: number
  completedAt?: number
  updatedAt?: number
  quitCount: number
  totalQuestions: number
  correctAnswers: number
  settings: {
    modules: string[]
    maxItems: number
    focusMode?: FocusFilter[]
  }
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
  responseTime?: number
}

export interface Module {
  id: string
  name: string
  description: string
  type: 'mcq' | 'true-false' | 'typing'
  settings: ModuleSettings
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export interface ModuleSettings {
  enabled: boolean
  weight: number
  options?: {
    numChoices?: number  // for MCQ
    allowPartialCredit?: boolean  // for typing
    caseSensitive?: boolean  // for typing
  }
}

export interface Project {
  id: string
  name: string
  description?: string
  items: string[]  // VocabItem IDs
  modules: string[]  // Module IDs
  tags?: string[]
  createdAt: number
  updatedAt: number
}

export interface FocusFilter {
  type: 'overdue' | 'low-sr' | 'high-decay' | 'new' | 'failed'
  enabled: boolean
  threshold?: number
}

export interface ItemStats {
  mastery: number
  successRate: number
  decay: number
  urgency: number
  totalAttempts: number
  daysSinceLastReview: number
  isOverdue: boolean
}

export interface SessionStats {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  averageResponseTime: number
  itemsCompleted: number
  itemsRemaining: number
  progress: number
  timeElapsed: number
}

export const DEFAULT_SETTINGS: Settings = {
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

export const DEFAULT_MODULE_SETTINGS = {
  mcq: {
    enabled: true,
    weight: 1.0,
    options: {
      numChoices: 4
    }
  },
  trueFalse: {
    enabled: true,
    weight: 1.0
  },
  typing: {
    enabled: true,
    weight: 1.0,
    options: {
      allowPartialCredit: true,
      caseSensitive: false
    }
  }
}
