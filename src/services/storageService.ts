import { AppState } from '../contexts/AppContext'

const STORAGE_KEYS = {
  VOCAB_DATA: 'vocab-queue-data',
  SETTINGS: 'vocab-queue-settings',
  BACKUP: 'vocab-queue-backup'
}

export class StorageService {
  // Save app state to localStorage
  static saveAppState(state: AppState): boolean {
    try {
      const dataToSave = {
        vocabItems: state.vocabItems,
        modules: state.modules,
        projects: state.projects,
        settings: state.settings,
        lastBackup: Date.now()
      }
      localStorage.setItem(STORAGE_KEYS.VOCAB_DATA, JSON.stringify(dataToSave))
      return true
    } catch (error) {
      console.error('Failed to save app state:', error)
      return false
    }
  }

  // Load app state from localStorage
  static loadAppState(): Partial<AppState> | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOCAB_DATA)
      if (!saved) return null

      const parsed = JSON.parse(saved)
      return {
        vocabItems: parsed.vocabItems || [],
        modules: parsed.modules || [],
        projects: parsed.projects || [],
        settings: parsed.settings || {
          speedMode: false,
          autoBackupInterval: 120,
          compactUI: false,
          language: 'en'
        }
      }
    } catch (error) {
      console.error('Failed to load app state:', error)
      return null
    }
  }

  // Create backup
  static createBackup(state: AppState): boolean {
    try {
      const backup = {
        ...state,
        backupCreatedAt: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup))
      return true
    } catch (error) {
      console.error('Failed to create backup:', error)
      return false
    }
  }

  // Load backup
  static loadBackup(): AppState | null {
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.BACKUP)
      if (!backup) return null

      return JSON.parse(backup)
    } catch (error) {
      console.error('Failed to load backup:', error)
      return null
    }
  }

  // Export full data as JSON
  static exportData(state: AppState): string {
    const exportData = {
      ...state,
      exportDate: Date.now(),
      version: '1.0'
    }
    return JSON.stringify(exportData, null, 2)
  }

  // Import data from JSON
  static importData(jsonString: string): AppState | null {
    try {
      const imported = JSON.parse(jsonString)

      // Validate basic structure
      if (!imported.vocabItems || !Array.isArray(imported.vocabItems)) {
        throw new Error('Invalid data format: missing vocabItems')
      }

      return {
        vocabItems: imported.vocabItems,
        modules: imported.modules || [],
        projects: imported.projects || [],
        currentSession: imported.currentSession || null,
        settings: imported.settings || {
          speedMode: false,
          autoBackupInterval: 120,
          compactUI: false,
          language: 'en'
        },
        sampleMode: imported.sampleMode || false
      }
    } catch (error) {
      console.error('Failed to import data:', error)
      return null
    }
  }

  // Clear all data
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  // Auto-backup functionality
  static startAutoBackup(state: AppState, intervalMinutes: number = 120): () => void {
    const intervalMs = intervalMinutes * 60 * 1000

    const backup = () => {
      this.createBackup(state)
    }

    // Initial backup
    backup()

    // Set up interval
    const intervalId = setInterval(backup, intervalMs)

    // Return cleanup function
    return () => clearInterval(intervalId)
  }
}
