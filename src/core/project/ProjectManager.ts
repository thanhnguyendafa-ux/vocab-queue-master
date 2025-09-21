import { DBService } from '../../services/db-service'
import { Module, Project, VocabItem } from '../models'

export class ProjectManager {
  static async createProject(name: string, description: string = '') {
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      items: [],
      modules: [],
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    await DBService.saveProject(project)
    return project
  }

  static async addModuleToProject(projectId: string, moduleId: string) {
    const project = await DBService.getProject(projectId)
    if (!project) throw new Error('Project not found')
    
    if (!project.modules.includes(moduleId)) {
      project.modules.push(moduleId)
      project.updatedAt = Date.now()
      await DBService.saveProject(project)
    }
    return project
  }

  static async removeModuleFromProject(projectId: string, moduleId: string) {
    const project = await DBService.getProject(projectId)
    if (!project) throw new Error('Project not found')
    
    project.modules = project.modules.filter(id => id !== moduleId)
    project.updatedAt = Date.now()
    await DBService.saveProject(project)
    return project
  }

  static async getProjectModules(projectId: string): Promise<Module[]> {
    const project = await DBService.getProject(projectId)
    if (!project) return []
    
    const modules = await Promise.all(
      project.modules.map(moduleId => DBService.getModule(moduleId))
    )
    return modules.filter(Boolean) as Module[]
  }

  static async getProjectItems(projectId: string): Promise<VocabItem[]> {
    const project = await DBService.getProject(projectId)
    if (!project) return []
    
    const modules = await this.getProjectModules(projectId)
    const allItems = await Promise.all(
      modules.map(module => 
        DBService.getVocabItems(module.id)
      )
    )
    
    // Flatten and deduplicate items
    const itemMap = new Map<string, VocabItem>()
    allItems.flat().forEach(item => {
      if (!itemMap.has(item.id)) {
        itemMap.set(item.id, item)
      }
    })
    
    return Array.from(itemMap.values())
  }

  static async updateProjectSettings(
    projectId: string, 
    updates: Partial<Pick<Project, 'name' | 'description' | 'tags'>>
  ) {
    const project = await DBService.getProject(projectId)
    if (!project) throw new Error('Project not found')
    
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: Date.now()
    }
    
    await DBService.saveProject(updatedProject)
    return updatedProject
  }
}
