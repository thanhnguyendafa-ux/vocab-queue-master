import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { Plus, Settings, Edit, Trash2, BookOpen, Shuffle, List } from 'lucide-react'

interface ModuleFormData {
  name: string
  tableId: string
  questionColumn: string
  answerColumn: string
  type: 'mcq' | 'true-false' | 'typing'
  distractors: number
}

interface ProjectFormData {
  name: string
  moduleIds: string[]
  mode: 'Random' | 'Ordered'
  weights?: Record<string, number>
}

export function Build() {
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState<'modules' | 'projects'>('modules')
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)

  const [moduleForm, setModuleForm] = useState<ModuleFormData>({
    name: '',
    tableId: '',
    questionColumn: '',
    answerColumn: '',
    type: 'typing',
    distractors: 3
  })

  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    name: '',
    moduleIds: [],
    mode: 'Random'
  })

  // Get available columns for a table
  const getTableColumns = (tableId: string) => {
    const table = state.vocabItems.find(item => item.id === tableId)
    if (!table) return []

    // Extract unique columns from vocab items
    const columns = new Set<string>()
    state.vocabItems.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'id' && key !== 'failed' && key !== 'passed1' && key !== 'passed2' &&
            key !== 'successRate' && key !== 'inQueue' && key !== 'quitQueue' && key !== 'rankPoint') {
          columns.add(key)
        }
      })
    })

    return Array.from(columns)
  }

  const handleCreateModule = () => {
    if (!moduleForm.name.trim() || !moduleForm.tableId) {
      alert('Please fill in all required fields (Module Name and Vocabulary Table)')
      return
    }

    if (!moduleForm.questionColumn || !moduleForm.answerColumn) {
      alert('Please select both Question Column and Answer Column')
      return
    }

    const newModule = {
      id: crypto.randomUUID(),
      name: moduleForm.name,
      tableId: moduleForm.tableId,
      questionColumn: moduleForm.questionColumn,
      answerColumn: moduleForm.answerColumn,
      type: moduleForm.type,
      distractors: moduleForm.distractors,
      lastCorrectIndex: undefined
    }

    dispatch({ type: 'ADD_MODULE', payload: newModule })
    setShowModuleForm(false)
    setModuleForm({
      name: '',
      tableId: '',
      questionColumn: '',
      answerColumn: '',
      type: 'typing',
      distractors: 3
    })

    alert(`Module "${newModule.name}" created successfully!`)
  }

  const handleUpdateModule = () => {
    if (!moduleForm.name.trim() || !moduleForm.tableId || !editingModule) {
      alert('Please fill in all required fields')
      return
    }

    dispatch({
      type: 'UPDATE_MODULE',
      payload: {
        id: editingModule,
        updates: {
          name: moduleForm.name,
          tableId: moduleForm.tableId,
          questionColumn: moduleForm.questionColumn,
          answerColumn: moduleForm.answerColumn,
          type: moduleForm.type,
          distractors: moduleForm.distractors
        }
      }
    })

    setShowModuleForm(false)
    setEditingModule(null)
    setModuleForm({
      name: '',
      tableId: '',
      questionColumn: '',
      answerColumn: '',
      type: 'typing',
      distractors: 3
    })
  }

  const handleEditModule = (moduleId: string) => {
    const module = state.modules.find(m => m.id === moduleId)
    if (!module) return

    setModuleForm({
      name: module.name,
      tableId: module.tableId,
      questionColumn: module.questionColumn,
      answerColumn: module.answerColumn,
      type: module.type,
      distractors: module.distractors || 3
    })
    setEditingModule(moduleId)
    setShowModuleForm(true)
  }

  const handleDeleteModule = (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      dispatch({ type: 'DELETE_MODULE', payload: moduleId })
    }
  }

  const handleCreateProject = () => {
    if (!projectForm.name.trim() || projectForm.moduleIds.length === 0) {
      alert('Please provide a name and select at least one module')
      return
    }

    const newProject = {
      id: crypto.randomUUID(),
      name: projectForm.name,
      moduleIds: projectForm.moduleIds,
      mode: projectForm.mode,
      weights: projectForm.mode === 'Random' ? projectForm.weights : undefined,
      lockedTableId: projectForm.moduleIds.length === 1
        ? state.modules.find(m => m.id === projectForm.moduleIds[0])?.tableId
        : undefined
    }

    dispatch({ type: 'ADD_PROJECT', payload: newProject })
    setShowProjectForm(false)
    setProjectForm({
      name: '',
      moduleIds: [],
      mode: 'Random'
    })
  }

  const handleUpdateProject = () => {
    if (!projectForm.name.trim() || projectForm.moduleIds.length === 0 || !editingProject) {
      alert('Please provide a name and select at least one module')
      return
    }

    dispatch({
      type: 'UPDATE_PROJECT',
      payload: {
        id: editingProject,
        updates: {
          name: projectForm.name,
          moduleIds: projectForm.moduleIds,
          mode: projectForm.mode,
          weights: projectForm.mode === 'Random' ? projectForm.weights : undefined,
          lockedTableId: projectForm.moduleIds.length === 1
            ? state.modules.find(m => m.id === projectForm.moduleIds[0])?.tableId
            : undefined
        }
      }
    })

    setShowProjectForm(false)
    setEditingProject(null)
    setProjectForm({
      name: '',
      moduleIds: [],
      mode: 'Random'
    })
  }

  const handleEditProject = (projectId: string) => {
    const project = state.projects.find(p => p.id === projectId)
    if (!project) return

    setProjectForm({
      name: project.name,
      moduleIds: project.moduleIds,
      mode: project.mode,
      weights: project.weights
    })
    setEditingProject(projectId)
    setShowProjectForm(true)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'DELETE_PROJECT', payload: projectId })
    }
  }

  // Methods for button handlers
  const setShowModuleFormHandler = (show: boolean) => setShowModuleForm(show)
  const setShowProjectFormHandler = (show: boolean) => setShowProjectForm(show)
  const handleEditModuleHandler = (id: string) => handleEditModule(id)
  const handleDeleteModuleHandler = (id: string) => handleDeleteModule(id)
  const handleEditProjectHandler = (id: string) => handleEditProject(id)
  const handleDeleteProjectHandler = (id: string) => handleDeleteProject(id)

  return (
    <div className="space-y-6" data-build-component>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Build</h1>
          <p className="text-gray-600">Create modules and projects for your study sessions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'modules'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Modules
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'projects'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Projects
        </button>
      </div>

      {/* Content */}
      {activeTab === 'modules' ? <ModulesTab /> : <ProjectsTab />}

      {/* Module Form Modal */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingModule ? 'Edit Module' : 'Create Module'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Name *
                </label>
                <input
                  type="text"
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({...moduleForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Basic Vocabulary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vocabulary Table *
                </label>
                <select
                  value={moduleForm.tableId}
                  onChange={(e) => setModuleForm({...moduleForm, tableId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a table</option>
                  {state.vocabItems.length > 0 && (
                    <option value="main-table">Main Vocabulary ({state.vocabItems.length} items)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Column *
                  </label>
                  <select
                    value={moduleForm.questionColumn}
                    onChange={(e) => setModuleForm({...moduleForm, questionColumn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column</option>
                    {moduleForm.tableId && getTableColumns(moduleForm.tableId).map(column => (
                      <option key={column} value={column}>{column}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer Column *
                  </label>
                  <select
                    value={moduleForm.answerColumn}
                    onChange={(e) => setModuleForm({...moduleForm, answerColumn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select column</option>
                    {moduleForm.tableId && getTableColumns(moduleForm.tableId).map(column => (
                      <option key={column} value={column}>{column}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type *
                </label>
                <select
                  value={moduleForm.type}
                  onChange={(e) => setModuleForm({...moduleForm, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="typing">Typing</option>
                  <option value="mcq">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>

              {moduleForm.type === 'mcq' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Distractors
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={moduleForm.distractors}
                    onChange={(e) => setModuleForm({...moduleForm, distractors: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowModuleForm(false)
                  setEditingModule(null)
                  setModuleForm({
                    name: '',
                    tableId: '',
                    questionColumn: '',
                    answerColumn: '',
                    type: 'typing',
                    distractors: 3
                  })
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingModule ? handleUpdateModule : handleCreateModule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingModule ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingProject ? 'Edit Project' : 'Create Project'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Daily Vocabulary Practice"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Mode *
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProjectForm({...projectForm, mode: 'Random'})}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      projectForm.mode === 'Random'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <Shuffle size={16} />
                    Random
                  </button>
                  <button
                    onClick={() => setProjectForm({...projectForm, mode: 'Ordered'})}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      projectForm.mode === 'Ordered'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    <List size={16} />
                    Ordered
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Modules *
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {state.modules.map(module => (
                    <label key={module.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={projectForm.moduleIds.includes(module.id)}
                        onChange={() => toggleModuleSelection(module.id)}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{module.name}</div>
                        <div className="text-xs text-gray-500">
                          {module.type.toUpperCase()} • {module.questionColumn} → {module.answerColumn}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {state.modules.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No modules available. Create modules first.</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowProjectForm(false)
                  setEditingProject(null)
                  setProjectForm({
                    name: '',
                    moduleIds: [],
                    mode: 'Random'
                  })
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingProject ? handleUpdateProject : handleCreateProject}
                disabled={projectForm.moduleIds.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                {editingProject ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ModulesTab() {
  const { state, dispatch } = useApp()

  const handleCreateModule = () => {
    // This will be handled by the modal in the main component
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Question Modules</h2>
        <button
          onClick={() => {
            const buildComponent = document.querySelector('[data-build-component]') as any
            if (buildComponent) {
              buildComponent.setShowModuleFormHandler(true)
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Module
        </button>
      </div>

      {state.modules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
          <p className="text-gray-600 mb-4">Create your first question module to generate study questions</p>
          <button
            onClick={() => {
              const buildComponent = document.querySelector('[data-build-component]') as any
              if (buildComponent) {
                buildComponent.setShowModuleForm(true)
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Module
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.modules.map((module) => (
            <div key={module.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{module.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {module.questionColumn} → {module.answerColumn}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const buildComponent = document.querySelector('[data-build-component]') as any
                      if (buildComponent) {
                        buildComponent.handleEditModule(module.id)
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const buildComponent = document.querySelector('[data-build-component]') as any
                      if (buildComponent) {
                        buildComponent.handleDeleteModule(module.id)
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded ${
                  module.type === 'mcq' ? 'bg-blue-100 text-blue-800' :
                  module.type === 'true-false' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {module.type.toUpperCase()}
                </span>

                {module.type === 'mcq' && (
                  <span className="text-xs text-gray-500">
                    {module.distractors} distractors
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectsTab() {
  const { state, dispatch } = useApp()
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    name: '',
    moduleIds: [],
    mode: 'Random'
  })

  const toggleModuleSelection = (moduleId: string) => {
    setProjectForm(prev => ({
      ...prev,
      moduleIds: prev.moduleIds.includes(moduleId)
        ? prev.moduleIds.filter(id => id !== moduleId)
        : [...prev.moduleIds, moduleId]
    }))
  }

  const handleCreateProject = () => {
    // This will be handled by the modal in the main component
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Study Projects</h2>
        <button
          onClick={() => {
            const buildComponent = document.querySelector('[data-build-component]') as any
            if (buildComponent) {
              buildComponent.setShowProjectForm(true)
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Project
        </button>
      </div>

      {state.projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Create your first study project to organize your learning sessions</p>
          <button
            onClick={() => {
              const buildComponent = document.querySelector('[data-build-component]') as any
              if (buildComponent) {
                buildComponent.setShowProjectForm(true)
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.projects.map((project) => (
            <div key={project.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.moduleIds.length} module{project.moduleIds.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const buildComponent = document.querySelector('[data-build-component]') as any
                      if (buildComponent) {
                        buildComponent.handleEditProject(project.id)
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const buildComponent = document.querySelector('[data-build-component]') as any
                      if (buildComponent) {
                        buildComponent.handleDeleteProject(project.id)
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded ${
                  project.mode === 'Random' ? 'bg-orange-100 text-orange-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {project.mode}
                </span>

                <span className="text-xs text-gray-500">
                  {project.lockedTableId ? 'Single Table' : 'Multi-Table'}
                </span>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                <div className="flex flex-wrap gap-1">
                  {project.moduleIds.slice(0, 3).map(moduleId => {
                    const module = state.modules.find(m => m.id === moduleId)
                    return module ? (
                      <span key={moduleId} className="px-1 py-0.5 bg-gray-100 rounded">
                        {module.name}
                      </span>
                    ) : null
                  })}
                  {project.moduleIds.length > 3 && (
                    <span className="px-1 py-0.5 bg-gray-100 rounded text-gray-400">
                      +{project.moduleIds.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
