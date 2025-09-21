import { DBService } from '../../services/db-service'
import { Project, VocabItem, Module } from '../models'

export class ImportExportManager {
  // Export project with all related data
  static async exportProject(projectId: string): Promise<string> {
    const project = await DBService.getProject(projectId)
    if (!project) throw new Error('Project not found')
    
    // Get all related data
    const [modules, items] = await Promise.all([
      Promise.all(project.modules.map(moduleId => DBService.getModule(moduleId))),
      DBService.getVocabItems(projectId)
    ])
    
    const exportData = {
      project,
      modules: modules.filter(Boolean) as Module[],
      items: items as VocabItem[],
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    
    return JSON.stringify(exportData, null, 2)
  }
  
  // Import project from exported data
  static async importProject(jsonData: string): Promise<Project> {
    try {
      const data = JSON.parse(jsonData)
      
      // Validate the import data
      if (!data.project || !data.modules || !data.items) {
        throw new Error('Invalid import data format')
      }
      
      // Generate new IDs to avoid conflicts
      const idMap = new Map<string, string>()
      
      // Save items with new IDs
      const savedItems = await Promise.all(
        data.items.map(async (item: VocabItem) => {
          const newId = crypto.randomUUID()
          idMap.set(item.id, newId)
          
          const newItem = {
            ...item,
            id: newId,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
          
          await DBService.saveVocabItem(newItem)
          return newItem
        })
      )
      
      // Save modules with new IDs and updated item references
      const savedModules = await Promise.all(
        data.modules.map(async (module: any) => {
          const newId = crypto.randomUUID()
          idMap.set(module.id, newId)
          
          const newModule = {
            ...module,
            id: newId,
            // Update any item references in the module
            items: module.items?.map((itemId: string) => idMap.get(itemId) || itemId)
          }
          
          await DBService.saveModule(newModule)
          return newModule
        })
      )
      
      // Save project with new IDs
      const newProjectId = crypto.randomUUID()
      const newProject: Project = {
        ...data.project,
        id: newProjectId,
        modules: savedModules.map(m => m.id),
        items: savedItems.map(i => i.id),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      await DBService.saveProject(newProject)
      return newProject
      
    } catch (error) {
      console.error('Import failed:', error)
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Export to CSV format
  static async exportToCSV(projectId: string, includeStats: boolean = false): Promise<string> {
    const project = await DBService.getProject(projectId)
    if (!project) throw new Error('Project not found')
    
    const items = await DBService.getVocabItems(projectId)
    
    // Define CSV headers
    const headers = ['Term', 'Definition', 'Example', 'Tags']
    
    if (includeStats) {
      headers.push('Passed', 'Failed', 'Last Reviewed')
    }
    
    // Convert items to CSV rows
    const rows = items.map(item => {
      const row = [
        `"${item.term}"`,
        `"${item.meaning}"`,
        `"${item.example || ''}"`,
        `"${item.tags?.join(',') || ''}"`
      ]
      
      if (includeStats) {
        row.push(
          (item.passed1 + item.passed2).toString(),
          item.failed.toString(),
          item.lastReviewedAt ? new Date(item.lastReviewedAt).toISOString() : ''
        )
      }
      
      return row.join(',')
    })
    
    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n')
  }
  
  // Import from CSV
  static async importFromCSV(csvData: string, projectId: string): Promise<VocabItem[]> {
    const lines = csvData.split('\n').filter(line => line.trim() !== '')
    if (lines.length < 2) throw new Error('CSV file is empty or has no headers')
    
    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const rows = lines.slice(1)
    
    // Validate required columns
    const requiredColumns = ['term', 'definition']
    const missingColumns = requiredColumns.filter(col => 
      !headers.includes(col.toLowerCase())
    )
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`)
    }
    
    // Parse rows and create items
    const items: VocabItem[] = []
    
    for (const row of rows) {
      const values = this.parseCSVRow(row)
      const item: Partial<VocabItem> = {
        id: crypto.randomUUID(),
        term: '',
        meaning: '',
        passed1: 0,
        passed2: 0,
        failed: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      // Map CSV columns to item properties
      headers.forEach((header, index) => {
        const value = values[index]?.trim()
        if (!value) return
        
        switch (header) {
          case 'term':
            item.term = value
            break
          case 'definition':
          case 'meaning':
            item.meaning = value
            break
          case 'example':
            item.example = value
            break
          case 'tags':
            item.tags = value.split(',').map(t => t.trim()).filter(Boolean)
            break
          case 'passed1':
          case 'passed2':
          case 'failed':
            item[header] = parseInt(value, 10) || 0
            break
          case 'lastreviewed':
            item.lastReviewedAt = new Date(value).getTime() || undefined
            break
        }
      })
      
      // Only add if we have required fields
      if (item.term && item.meaning) {
        items.push(item as VocabItem)
      }
    }
    
    // Save items to database
    await Promise.all(items.map(item => DBService.saveVocabItem(item as VocabItem)))
    
    // Update project with new items
    if (projectId) {
      const project = await DBService.getProject(projectId)
      if (project) {
        const existingItems = await DBService.getVocabItems(projectId)
        const existingIds = new Set(existingItems.map(i => i.id))
        
        // Add new items to project
        const newItems = items.filter(item => !existingIds.has(item.id))
        if (newItems.length > 0) {
          project.items = [...new Set([...project.items, ...newItems.map(i => i.id)])]
          project.updatedAt = Date.now()
          await DBService.saveProject(project)
        }
      }
    }
    
    return items
  }
  
  // Helper to parse CSV row with quoted values
  private static parseCSVRow(row: string): string[] {
    const result: string[] = []
    let inQuotes = false
    let current = ''
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    // Add the last field
    result.push(current)
    
    return result
  }
}
