import React, { useState, useEffect } from 'react'
import { VocabItem, Project } from '../../../core/models'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { X, Plus, Minus } from 'lucide-react'

interface VocabItemFormProps {
  item?: VocabItem | null
  projects: Project[]
  onSave: (item: Omit<VocabItem, 'id' | 'createdAt' | 'updatedAt' | 'passed1' | 'passed2' | 'failed'>) => void
  onCancel: () => void
}

export function VocabItemForm({ item, projects, onSave, onCancel }: VocabItemFormProps) {
  const [formData, setFormData] = useState({
    term: '',
    meaning: '',
    example: '',
    tags: [] as string[],
    selectedProjects: [] as string[]
  })
  
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (item) {
      setFormData({
        term: item.term,
        meaning: item.meaning,
        example: item.example || '',
        tags: item.tags || [],
        selectedProjects: projects.filter(p => p.items.includes(item.id)).map(p => p.id)
      })
    }
  }, [item, projects])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.term.trim()) {
      newErrors.term = 'Term is required'
    }
    
    if (!formData.meaning.trim()) {
      newErrors.meaning = 'Meaning is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const itemData = {
      term: formData.term.trim(),
      meaning: formData.meaning.trim(),
      example: formData.example.trim() || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      lastReviewedAt: item?.lastReviewedAt
    }
    
    onSave(itemData)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const toggleProject = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter(id => id !== projectId)
        : [...prev.selectedProjects, projectId]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{item ? 'Edit Vocabulary Item' : 'Add New Vocabulary Item'}</CardTitle>
              <CardDescription>
                {item ? 'Update the vocabulary item details' : 'Create a new vocabulary item for your collection'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Term */}
            <div>
              <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
                Term *
              </label>
              <Input
                id="term"
                value={formData.term}
                onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                placeholder="Enter the vocabulary term"
                error={!!errors.term}
              />
              {errors.term && (
                <p className="text-sm text-red-500 mt-1">{errors.term}</p>
              )}
            </div>

            {/* Meaning */}
            <div>
              <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-2">
                Meaning *
              </label>
              <textarea
                id="meaning"
                value={formData.meaning}
                onChange={(e) => setFormData(prev => ({ ...prev, meaning: e.target.value }))}
                placeholder="Enter the meaning or definition"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.meaning ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.meaning && (
                <p className="text-sm text-red-500 mt-1">{errors.meaning}</p>
              )}
            </div>

            {/* Example */}
            <div>
              <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-2">
                Example (Optional)
              </label>
              <textarea
                id="example"
                value={formData.example}
                onChange={(e) => setFormData(prev => ({ ...prev, example: e.target.value }))}
                placeholder="Enter an example sentence"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              
              {/* Existing Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Add New Tag */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add to Projects (Optional)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {projects.map(project => (
                    <label key={project.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedProjects.includes(project.id)}
                        onChange={() => toggleProject(project.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{project.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {item ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
