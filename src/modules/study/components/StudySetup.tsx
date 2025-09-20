import React, { useState } from 'react'
import { useQuizStore } from '../../../store/useQuizStore'
import { FocusFilter } from '../../../core/models'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { ArrowLeft, Play, Settings, Filter, Target } from 'lucide-react'

interface StudySetupProps {
  onCancel: () => void
  onStart: (projectId: string, options: {
    modules?: string[]
    maxItems?: number
    focusFilters?: FocusFilter[]
  }) => void
}

export function StudySetup({ onCancel, onStart }: StudySetupProps) {
  const { projects, modules, items } = useQuizStore()
  
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [maxItems, setMaxItems] = useState(20)
  const [selectedModules, setSelectedModules] = useState<string[]>(['mcq_default'])
  const [focusFilters, setFocusFilters] = useState<FocusFilter[]>([
    { type: 'overdue', enabled: false, threshold: 7 },
    { type: 'low-sr', enabled: false, threshold: 0.6 },
    { type: 'high-decay', enabled: false, threshold: 0.6 },
    { type: 'new', enabled: false },
    { type: 'failed', enabled: false }
  ])
  
  const selectedProjectData = projects.find(p => p.id === selectedProject)
  const availableItems = selectedProjectData 
    ? items.filter(item => selectedProjectData.items.includes(item.id))
    : []

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleFilterToggle = (filterType: FocusFilter['type']) => {
    setFocusFilters(prev => 
      prev.map(filter => 
        filter.type === filterType 
          ? { ...filter, enabled: !filter.enabled }
          : filter
      )
    )
  }

  const handleFilterThresholdChange = (filterType: FocusFilter['type'], threshold: number) => {
    setFocusFilters(prev => 
      prev.map(filter => 
        filter.type === filterType 
          ? { ...filter, threshold }
          : filter
      )
    )
  }

  const handleStart = () => {
    if (!selectedProject) return
    
    const enabledFilters = focusFilters.filter(f => f.enabled)
    
    onStart(selectedProject, {
      modules: selectedModules,
      maxItems,
      focusFilters: enabledFilters.length > 0 ? enabledFilters : undefined
    })
  }

  const getFilterDescription = (filter: FocusFilter) => {
    switch (filter.type) {
      case 'overdue':
        return `Items not reviewed for ${filter.threshold || 7} days`
      case 'low-sr':
        return `Items with success rate below ${Math.round((filter.threshold || 0.6) * 100)}%`
      case 'high-decay':
        return `Items with high memory decay (below ${Math.round((filter.threshold || 0.6) * 100)}%)`
      case 'new':
        return 'Items never studied before'
      case 'failed':
        return 'Items with recent incorrect answers'
      default:
        return ''
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Session Setup</h1>
          <p className="text-gray-600 mt-2">
            Configure your study session preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Select Project
              </CardTitle>
              <CardDescription>
                Choose which vocabulary collection to study
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No projects available</p>
                  <Button variant="outline" onClick={() => window.location.href = '/library'}>
                    Create Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {projects.map(project => (
                    <div
                      key={project.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedProject === project.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-500">
                            {project.items.length} vocabulary items
                          </p>
                          {project.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <input
                          type="radio"
                          checked={selectedProject === project.id}
                          onChange={() => setSelectedProject(project.id)}
                          className="text-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Study Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Question Types
              </CardTitle>
              <CardDescription>
                Select which types of questions to include
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {modules.filter(m => m.isActive).map(module => (
                  <label
                    key={module.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module.id)}
                      onChange={() => handleModuleToggle(module.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-gray-500">{module.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Focus Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Focus Filters
              </CardTitle>
              <CardDescription>
                Target specific types of vocabulary items (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {focusFilters.map(filter => (
                  <div key={filter.type} className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={filter.enabled}
                        onChange={() => handleFilterToggle(filter.type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium capitalize">
                          {filter.type.replace('-', ' ')} Items
                        </div>
                        <div className="text-sm text-gray-500">
                          {getFilterDescription(filter)}
                        </div>
                      </div>
                    </label>
                    
                    {filter.enabled && filter.threshold !== undefined && (
                      <div className="ml-6">
                        <Input
                          type="number"
                          value={filter.threshold}
                          onChange={(e) => handleFilterThresholdChange(
                            filter.type, 
                            parseFloat(e.target.value) || 0
                          )}
                          className="w-24"
                          step={filter.type === 'overdue' ? 1 : 0.1}
                          min={0}
                          max={filter.type === 'overdue' ? 365 : 1}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Items
                </label>
                <Input
                  type="number"
                  value={maxItems}
                  onChange={(e) => setMaxItems(parseInt(e.target.value) || 20)}
                  min={1}
                  max={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Limit the number of items in this session
                </p>
              </div>
            </CardContent>
          </Card>

          {selectedProjectData && (
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Items:</span>
                  <span className="font-medium">{availableItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Items:</span>
                  <span className="font-medium">
                    {availableItems.filter(item => item.passed1 === 0 && item.passed2 === 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress:</span>
                  <span className="font-medium">
                    {availableItems.filter(item => item.passed1 > 0 && item.passed2 === 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mastered:</span>
                  <span className="font-medium">
                    {availableItems.filter(item => item.passed2 > 0).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleStart}
              disabled={!selectedProject || selectedModules.length === 0}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Study Session
            </Button>
            
            <Button variant="outline" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
