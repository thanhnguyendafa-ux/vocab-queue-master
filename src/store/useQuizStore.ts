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
  calculateUrgency, 
  filterItems,
  buildFocusQueue,
  getItemStatistics
} from '../core/algo/stats'
import {
  createInitialQueue,
  calculateSessionStats
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
        set((state) => {
          // Find the project
          const project = state.projects.find(p => p.id === projectId);
          if (!project) return state;

          // Get items for the project
          let sessionItems = state.items.filter(item => 
            project.items.includes(item.id)
          );

          // Apply focus filters if any
          if (options.focusFilters && options.focusFilters.length > 0) {
            sessionItems = filterItems(
              sessionItems,
              state.settings,
              options.focusFilters,
              'OR'
            );
          }

          // Limit number of items if specified
          if (options.maxItems && sessionItems.length > options.maxItems) {
            sessionItems = sessionItems.slice(0, options.maxItems);
          }

          // Create initial queue based on urgency
          if (sessionItems.length > 0) {
            const urgencyCalculator = (item: VocabItem) => calculateUrgency(item, {
              halfLifeDays: state.settings.halfLifeDays,
              guessBaseline: state.settings.guessBaseline,
              timeWeight: state.settings.focusThresholds.w_t,
              srWeight: state.settings.focusThresholds.w_s,
              decayWeight: state.settings.focusThresholds.w_d
            });
            
            sessionItems = createInitialQueue(sessionItems, urgencyCalculator);
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
            totalQuestions: sessionItems.length,
            correctAnswers: 0,
            settings: {
              modules: options.modules || [],
              maxItems: options.maxItems || 20,
              focusMode: options.focusFilters || []
            }
          };

          return {
            currentSession: newSession,
            currentQuestions: [],
            completedItems: []
          };
        });
      },

      // Process user answer for a question
      processAnswer: (questionId, answer, isCorrect, responseTime) => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const currentQuestion = state.currentQuestions.find(q => q.id === questionId);
          if (!currentQuestion) return state;

          // Update question with answer
          const updatedQuestion: QuizQuestion = {
            ...currentQuestion,
            userAnswer: answer,
            isCorrect,
            answeredAt: Date.now(),
            responseTime
          };

          // Calculate new correct answers count
          const newCorrectAnswers = isCorrect 
            ? state.currentSession.correctAnswers + 1 
            : state.currentSession.correctAnswers;

          // Check if session is complete
          const isComplete = newCorrectAnswers >= state.currentSession.totalQuestions;

          // Create updated session without completedAt if not complete
          const updatedSession: StudySession = isComplete
            ? {
                ...state.currentSession,
                correctAnswers: newCorrectAnswers,
                completed: true,
                completedAt: Date.now(),
                updatedAt: Date.now()
              }
            : {
                ...state.currentSession,
                correctAnswers: newCorrectAnswers,
                completed: false,
                updatedAt: Date.now()
              };

          // Update item stats
          const updatedItems = state.items.map(item => {
            if (item.id !== currentQuestion.item.id) return item;
            
            return {
              ...item,
              passed1: isCorrect ? item.passed1 + 1 : item.passed1,
              failed: isCorrect ? item.failed : item.failed + 1,
              lastReviewedAt: Date.now(),
              updatedAt: Date.now()
            };
          });

          // Update completed items
          const completedItems = isCorrect 
            ? [...state.completedItems, currentQuestion.item]
            : state.completedItems;

          // Return updated state
          return {
            items: updatedItems,
            completedItems,
            currentSession: updatedSession,
            currentQuestions: state.currentQuestions.map(q => 
              q.id === questionId ? updatedQuestion : q
            )
          };
        });
      },

      // Quit current session
      quitSession: () => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const updatedSession: StudySession = {
            ...state.currentSession,
            quitCount: state.currentSession.quitCount + 1,
            completed: false
          };

          const result: Partial<QuizStore> = {
            currentSession: null,
            currentQuestions: [],
            sessionHistory: [...state.sessionHistory, updatedSession]
          };

          return result;
        });
      },

      // Complete current session
      completeSession: () => {
        set((state) => {
          if (!state.currentSession) return state;
          
          const completedSession: StudySession = {
            ...state.currentSession,
            completed: true,
            completedAt: Date.now()
          };

          const result: Partial<QuizStore> = {
            currentSession: null,
            currentQuestions: [],
            completedItems: [],
            sessionHistory: [...state.sessionHistory, completedSession]
          };

          return result;
        });
      },

      // Resume a previous session
      resumeSession: (sessionId) => {
        set((state) => {
          const sessionIndex = state.sessionHistory.findIndex(s => s.id === sessionId);
          if (sessionIndex === -1 || !state.sessionHistory[sessionIndex]) return state;

          const session = state.sessionHistory[sessionIndex];
          const remainingSessions = state.sessionHistory.filter(s => s.id !== sessionId);

          // Ensure all required properties are set when creating a new session
          const newSession: StudySession = {
            id: session.id,
            projectId: session.projectId,
            items: [...session.items],
            originalItems: [...session.originalItems],
            currentIndex: 0,  // Reset index for new session
            completed: false,  // Reset completion status
            startedAt: session.startedAt,  // Keep original start time
            updatedAt: Date.now(),
            quitCount: session.quitCount || 0,
            totalQuestions: session.totalQuestions,
            correctAnswers: 0,  // Reset correct answers
            settings: {
              modules: [...session.settings.modules],
              maxItems: session.settings.maxItems,
              ...(session.settings.focusMode && session.settings.focusMode.length > 0 
                ? { focusMode: [...session.settings.focusMode] } 
                : {})
            }
          };

          // Return the updated state with the new session
          return {
            currentSession: newSession,
            currentQuestions: [],
            sessionHistory: remainingSessions
          };
        });
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
