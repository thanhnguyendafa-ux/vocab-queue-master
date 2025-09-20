// Zustand store placeholder - will be implemented in next steps

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  VocabItem, 
  Settings, 
  StudySession, 
  Module, 
  Project, 
  QuizQuestion,
  FocusFilter,
  ItemStats,
  SessionStats,
  DEFAULT_SETTINGS,
  DEFAULT_MODULE_SETTINGS
} from '../core/models'
import { 
  calculateMastery, 
  calculateUrgency, 
  filterItems,
  getFilterSets,
  buildFocusQueue,
  getItemStatistics
} from '../core/algo/stats'
import {
  processAnswer,
  createInitialQueue,
  getSessionProgress,
  isSessionComplete,
  calculateSessionStats,
  handleSessionInterruption,
  saveQueueState,
  loadQueueState,
  clearQueueState
} from '../core/algo/queue'

interface QuizStore {
  // Core data
  items: VocabItem[]
  modules: Module[]
  projects: Project[]
  settings: Settings
  
  // Session management
  currentSession: StudySession | null
  sessionHistory: StudySession[]
  currentQuestions: QuizQuestion[]
  completedItems: VocabItem[]
  
  // UI state
  loading: boolean
  error: string | null
  
  // Actions - Item management
  addItem: (item: Omit<VocabItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateItem: (id: string, updates: Partial<VocabItem>) => void
  deleteItem: (id: string) => void
  importItems: (items: VocabItem[]) => void
  
  // Actions - Module management
  addModule: (module: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateModule: (id: string, updates: Partial<Module>) => void
  deleteModule: (id: string) => void
  
  // Actions - Project management
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  // Actions - Session management
  startSession: (projectId: string, options?: {
    modules?: string[]
    maxItems?: number
    focusFilters?: FocusFilter[]
  }) => void
  processAnswer: (questionId: string, answer: string, isCorrect: boolean, responseTime: number) => void
  quitSession: () => void
  completeSession: () => void
  resumeSession: (sessionId: string) => void
  
  // Actions - Settings
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
  
  // Actions - Statistics and filtering
  getItemStats: (itemId: string) => ItemStats | null
  getSessionStats: () => SessionStats | null
  getFilteredItems: (filters: FocusFilter[], logic?: 'AND' | 'OR') => VocabItem[]
  getFocusQueue: (filters: FocusFilter[], maxItems?: number) => VocabItem[]
  
  // Actions - Data management
  exportData: () => string
  importData: (jsonData: string) => void
  clearAllData: () => void
  
  // Actions - UI state
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      modules: [
        {
          id: 'mcq_default',
          name: 'Multiple Choice Questions',
          description: 'Choose the correct meaning from 4 options',
          type: 'mcq',
          settings: DEFAULT_MODULE_SETTINGS.mcq,
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 'tf_default',
          name: 'True or False',
          description: 'Decide if the statement is true or false',
          type: 'true-false',
          settings: DEFAULT_MODULE_SETTINGS.trueFalse,
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 'typing_default',
          name: 'Type the Answer',
          description: 'Type the correct meaning or term',
          type: 'typing',
          settings: DEFAULT_MODULE_SETTINGS.typing,
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ],
      projects: [],
      settings: DEFAULT_SETTINGS,
      currentSession: null,
      sessionHistory: [],
      currentQuestions: [],
      completedItems: [],
      loading: false,
      error: null,

      // Item management actions
      addItem: (itemData) => {
        const newItem: VocabItem = {
          ...itemData,
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          passed1: 0,
          passed2: 0,
          failed: 0,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        
        set((state) => ({
          items: [...state.items, newItem]
        }))
      },
      
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === id 
              ? { ...item, ...updates, updatedAt: Date.now() }
              : item
          )
        }))
      },
      
      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
          projects: state.projects.map(project => ({
            ...project,
            items: project.items.filter(itemId => itemId !== id)
          }))
        }))
      },
      
      importItems: (items) => {
        set((state) => ({
          items: [...state.items, ...items]
        }))
      },

      // Module management actions
      addModule: (moduleData) => {
        const newModule: Module = {
          ...moduleData,
          id: `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        
        set((state) => ({
          modules: [...state.modules, newModule]
        }))
      },
      
      updateModule: (id, updates) => {
        set((state) => ({
          modules: state.modules.map(module => 
            module.id === id 
              ? { ...module, ...updates, updatedAt: Date.now() }
              : module
          )
        }))
      },
      
      deleteModule: (id) => {
        set((state) => ({
          modules: state.modules.filter(module => module.id !== id),
          projects: state.projects.map(project => ({
            ...project,
            modules: project.modules.filter(moduleId => moduleId !== id)
          }))
        }))
      },

      // Project management actions
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        
        set((state) => ({
          projects: [...state.projects, newProject]
        }))
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map(project => 
            project.id === id 
              ? { ...project, ...updates, updatedAt: Date.now() }
              : project
          )
        }))
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id)
        }))
      },

      // Session management actions
      startSession: (projectId, options = {}) => {
        const state = get()
        const project = state.projects.find(p => p.id === projectId)
        if (!project) return

        const projectItems = state.items.filter(item => 
          project.items.includes(item.id)
        )

        // Apply focus filters if specified
        let sessionItems = projectItems
        if (options.focusFilters && options.focusFilters.length > 0) {
          sessionItems = buildFocusQueue(
            projectItems,
            state.settings,
            options.focusFilters,
            options.maxItems || 20
          )
        } else if (options.maxItems && sessionItems.length > options.maxItems) {
          // Sort by urgency and take top items
          const urgencyCalculator = (item: VocabItem) => calculateUrgency(item, {
            halfLifeDays: state.settings.halfLifeDays,
            guessBaseline: state.settings.guessBaseline,
            timeWeight: state.settings.focusThresholds.w_t,
            srWeight: state.settings.focusThresholds.w_s,
            decayWeight: state.settings.focusThresholds.w_d
          })
          
          sessionItems = createInitialQueue(sessionItems, urgencyCalculator)
            .slice(0, options.maxItems)
        } else {
          // Create initial queue with urgency-based ordering
          const urgencyCalculator = (item: VocabItem) => calculateUrgency(item, {
            halfLifeDays: state.settings.halfLifeDays,
            guessBaseline: state.settings.guessBaseline,
            timeWeight: state.settings.focusThresholds.w_t,
            srWeight: state.settings.focusThresholds.w_s,
            decayWeight: state.settings.focusThresholds.w_d
          })
          
          sessionItems = createInitialQueue(sessionItems, urgencyCalculator)
        }

        const newSession: StudySession = {
          id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          projectId,
          items: [...sessionItems],
          originalItems: [...sessionItems],
          currentIndex: 0,
          completed: false,
          startedAt: Date.now(),
          quitCount: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          settings: {
            modules: options.modules || project.modules,
            maxItems: options.maxItems || sessionItems.length,
            focusMode: options.focusFilters
          }
        }

        set(() => ({
          currentSession: newSession,
          currentQuestions: [],
          completedItems: []
        }))
      },

      processAnswer: (questionId, answer, isCorrect, responseTime) => {
        set((state) => {
          if (!state.currentSession) return state

          const question = state.currentQuestions.find(q => q.id === questionId)
          if (!question) return state

          // Update question with answer
          const updatedQuestions = state.currentQuestions.map(q =>
            q.id === questionId
              ? { ...q, userAnswer: answer, isCorrect, answeredAt: Date.now(), responseTime }
              : q
          )

          // Process the answer using queue algorithm
          const currentItem = state.currentSession.items.find(item => item.id === question.item.id)
          if (!currentItem) return state

          const { updatedItem, newQueue } = processAnswer(
            currentItem,
            isCorrect,
            state.currentSession.items
          )

          // Update the item in the main items array
          const updatedItems = state.items.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          )

          // Update completed items if item was removed from queue
          let updatedCompletedItems = state.completedItems
          if (!newQueue.find(item => item.id === updatedItem.id) && updatedItem.passed2 > 0) {
            updatedCompletedItems = [...state.completedItems, updatedItem]
          }

          // Check if session is complete
          const sessionComplete = isSessionComplete(
            state.currentSession.originalItems,
            newQueue,
            updatedCompletedItems
          )

          const updatedSession: StudySession = {
            ...state.currentSession,
            items: newQueue,
            currentIndex: Math.min(state.currentSession.currentIndex, newQueue.length - 1),
            totalQuestions: state.currentSession.totalQuestions + 1,
            correctAnswers: state.currentSession.correctAnswers + (isCorrect ? 1 : 0),
            completed: sessionComplete,
            completedAt: sessionComplete ? Date.now() : undefined
          }

          return {
            items: updatedItems,
            currentSession: sessionComplete ? null : updatedSession,
            sessionHistory: sessionComplete 
              ? [...state.sessionHistory, updatedSession]
              : state.sessionHistory,
            currentQuestions: updatedQuestions,
            completedItems: updatedCompletedItems
          }
        })
      },

      quitSession: () => {
        set((state) => {
          if (!state.currentSession) return state

          const { updatedSession, shouldSave } = handleSessionInterruption(
            state.currentSession,
            state.currentSession.items,
            state.completedItems,
            'quit'
          )

          return {
            currentSession: null,
            sessionHistory: [...state.sessionHistory, updatedSession],
            currentQuestions: [],
            completedItems: []
          }
        })
      },

      completeSession: () => {
        set((state) => {
          if (!state.currentSession) return state

          const completedSession = {
            ...state.currentSession,
            completed: true,
            completedAt: Date.now()
          }

          // Clear any saved queue state since session is complete
          clearQueueState(state.currentSession.id)

          return {
            currentSession: null,
            sessionHistory: [...state.sessionHistory, completedSession],
            currentQuestions: [],
            completedItems: []
          }
        })
      },

      resumeSession: (sessionId) => {
        const state = get()
        const savedState = loadQueueState(sessionId)
        
        if (savedState) {
          const session = state.sessionHistory.find(s => s.id === sessionId)
          if (session && !session.completed) {
            set(() => ({
              currentSession: {
                ...session,
                items: savedState.queue,
                quitCount: savedState.quitCount
              },
              sessionHistory: state.sessionHistory.filter(s => s.id !== sessionId),
              completedItems: savedState.completedItems || [],
              currentQuestions: []
            }))
          }
        }
      },

      // Settings actions
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }))
      },

      resetSettings: () => {
        set(() => ({
          settings: DEFAULT_SETTINGS
        }))
      },

      // Statistics and filtering actions
      getItemStats: (itemId) => {
        const state = get()
        const item = state.items.find(i => i.id === itemId)
        if (!item) return null

        return getItemStatistics(item, state.settings)
      },

      getSessionStats: () => {
        const state = get()
        if (!state.currentSession) return null

        return calculateSessionStats(state.currentSession, state.currentQuestions)
      },

      getFilteredItems: (filters, logic = 'OR') => {
        const state = get()
        return filterItems(state.items, state.settings, filters, logic)
      },

      getFocusQueue: (filters, maxItems = 20) => {
        const state = get()
        return buildFocusQueue(state.items, state.settings, filters, maxItems)
      },

      // Data management actions
      exportData: () => {
        const state = get()
        return JSON.stringify({
          version: '1.0.0',
          createdAt: Date.now(),
          data: {
            items: state.items,
            modules: state.modules,
            projects: state.projects,
            settings: state.settings
          }
        }, null, 2)
      },

      importData: (jsonData) => {
        try {
          const backup = JSON.parse(jsonData)
          if (backup.data) {
            set(() => ({
              items: backup.data.items || [],
              modules: backup.data.modules || [],
              projects: backup.data.projects || [],
              settings: { ...DEFAULT_SETTINGS, ...backup.data.settings }
            }))
          }
        } catch (error) {
          console.error('Failed to import data:', error)
          get().setError('Failed to import data. Please check the file format.')
        }
      },

      clearAllData: () => {
        set(() => ({
          items: [],
          projects: [],
          currentSession: null,
          sessionHistory: [],
          currentQuestions: [],
          completedItems: [],
          settings: DEFAULT_SETTINGS
        }))
      },

      // UI state actions
      setLoading: (loading) => {
        set(() => ({ loading }))
      },

      setError: (error) => {
        set(() => ({ error }))
      }
    }),
    {
      name: 'vocab-queue-master-store',
      partialize: (state) => ({
        items: state.items,
        modules: state.modules,
        projects: state.projects,
        settings: state.settings,
        sessionHistory: state.sessionHistory
      })
    }
  )
)
