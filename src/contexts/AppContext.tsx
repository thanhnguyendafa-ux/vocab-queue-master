import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { loadSampleData } from '../data/sampleData'
import { StorageService } from '../services/storageService'

// Core data types
export interface VocabItem {
  id: string
  keyword: string
  definition: string
  example?: string
  pronunciation?: string
  imageUrl?: string
  tag?: string

  // Learning statistics
  failed: number
  passed1: number  // Correct on first attempt
  passed2: number  // Correct on second attempt
  successRate: number

  // Session tracking
  inQueue: number
  quitQueue: number
  lastDayPractice?: string

  // Ranking system
  rankPoint: number
}

export interface Module {
  id: string
  name: string
  tableId: string
  questionColumn: string
  answerColumn: string
  type: 'mcq' | 'true-false' | 'typing'
  distractors?: number
  lastCorrectIndex?: number
}

export interface Project {
  id: string
  name: string
  moduleIds: string[]
  mode: 'Random' | 'Ordered'
  weights?: Record<string, number>
  lockedTableId?: string
}

export interface StudySession {
  id: string
  projectId: string
  items: VocabItem[]
  currentIndex: number
  completed: boolean
  startedAt: number
  completedAt?: number
  quitCount: number
  totalQuestions: number
  correctAnswers: number
  settings: {
    speedMode: boolean
  }
}

export interface Settings {
  speedMode: boolean
  autoBackupInterval: number // minutes
  compactUI: boolean
  language: string
}

export interface AppState {
  vocabItems: VocabItem[]
  modules: Module[]
  projects: Project[]
  currentSession: StudySession | null
  settings: Settings
  sampleMode: boolean
}

// Action types
export type AppAction =
  | { type: 'ADD_VOCAB_ITEM'; payload: VocabItem }
  | { type: 'UPDATE_VOCAB_ITEM'; payload: { id: string; updates: Partial<VocabItem> } }
  | { type: 'DELETE_VOCAB_ITEM'; payload: string }
  | { type: 'ADD_MODULE'; payload: Module }
  | { type: 'UPDATE_MODULE'; payload: { id: string; updates: Partial<Module> } }
  | { type: 'DELETE_MODULE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'START_SESSION'; payload: StudySession }
  | { type: 'UPDATE_SESSION'; payload: Partial<StudySession> }
  | { type: 'END_SESSION' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'TOGGLE_SAMPLE_MODE' }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }

// Initial state
export const initialState: AppState = {
  vocabItems: [],
  modules: [],
  projects: [],
  currentSession: null,
  settings: {
    speedMode: false,
    autoBackupInterval: 120, // 2 hours
    compactUI: false,
    language: 'en'
  },
  sampleMode: false
}

// Reducer
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_VOCAB_ITEM':
      return { ...state, vocabItems: [...state.vocabItems, action.payload] }
    case 'UPDATE_VOCAB_ITEM':
      return {
        ...state,
        vocabItems: state.vocabItems.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        )
      }
    case 'DELETE_VOCAB_ITEM':
      return {
        ...state,
        vocabItems: state.vocabItems.filter(item => item.id !== action.payload)
      }
    case 'ADD_MODULE':
      return { ...state, modules: [...state.modules, action.payload] }
    case 'UPDATE_MODULE':
      return {
        ...state,
        modules: state.modules.map(module =>
          module.id === action.payload.id
            ? { ...module, ...action.payload.updates }
            : module
        )
      }
    case 'DELETE_MODULE':
      return {
        ...state,
        modules: state.modules.filter(module => module.id !== action.payload)
      }
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.updates }
            : project
        )
      }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      }
    case 'START_SESSION':
      return { ...state, currentSession: action.payload }
    case 'UPDATE_SESSION':
      return {
        ...state,
        currentSession: state.currentSession
          ? { ...state.currentSession, ...action.payload }
          : null
      }
    case 'END_SESSION':
      return { ...state, currentSession: null }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'TOGGLE_SAMPLE_MODE':
      const newSampleMode = !state.sampleMode
      if (newSampleMode) {
        // Load sample data
        const sampleData = loadSampleData()
        return {
          ...state,
          sampleMode: true,
          vocabItems: sampleData.vocabItems,
          modules: sampleData.modules,
          projects: sampleData.projects
        }
      } else {
        // Clear sample data
        return {
          ...state,
          sampleMode: false,
          vocabItems: [],
          modules: [],
          projects: []
        }
      }
    case 'LOAD_DATA':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load saved data on mount
  useEffect(() => {
    const savedData = StorageService.loadAppState()
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: savedData })
    }
  }, [])

  // Auto-save data
  useEffect(() => {
    if (state.vocabItems.length > 0 || state.modules.length > 0 || state.projects.length > 0) {
      StorageService.saveAppState(state)
    }
  }, [state.vocabItems, state.modules, state.projects, state.settings])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
