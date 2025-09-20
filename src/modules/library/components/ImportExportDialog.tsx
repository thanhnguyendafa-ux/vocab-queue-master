import React, { useState, useRef } from 'react'
import { useQuizStore } from '../../../store/useQuizStore'
import { VocabItem } from '../../../core/models'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { X, Download, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface ImportExportDialogProps {
  onClose: () => void
}

export function ImportExportDialog({ onClose }: ImportExportDialogProps) {
  const { items, projects, exportData, importData, importItems } = useQuizStore()
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'csv'>('export')
  const [importText, setImportText] = useState('')
  const [csvText, setCsvText] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportJSON = () => {
    try {
      const data = exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vocab-queue-master-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: 'Data exported successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' })
    }
  }

  const handleImportJSON = () => {
    try {
      if (!importText.trim()) {
        setMessage({ type: 'error', text: 'Please paste JSON data to import' })
        return
      }
      
      importData(importText)
      setMessage({ type: 'success', text: 'Data imported successfully!' })
      setImportText('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid JSON format. Please check your data.' })
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        if (file.name.endsWith('.json')) {
          importData(content)
          setMessage({ type: 'success', text: 'JSON file imported successfully!' })
        } else if (file.name.endsWith('.csv')) {
          const items = parseCSV(content)
          importItems(items)
          setMessage({ type: 'success', text: `Imported ${items.length} vocabulary items from CSV!` })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to import file. Please check the format.' })
      }
    }
    reader.readAsText(file)
  }

  const parseCSV = (csvContent: string): VocabItem[] => {
    const lines = csvContent.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    const termIndex = headers.findIndex(h => h.includes('term') || h.includes('word'))
    const meaningIndex = headers.findIndex(h => h.includes('meaning') || h.includes('definition'))
    const exampleIndex = headers.findIndex(h => h.includes('example') || h.includes('sentence'))
    
    if (termIndex === -1 || meaningIndex === -1) {
      throw new Error('CSV must contain at least "term" and "meaning" columns')
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      
      return {
        id: `imported_${Date.now()}_${index}`,
        term: values[termIndex] || '',
        meaning: values[meaningIndex] || '',
        example: exampleIndex >= 0 ? values[exampleIndex] : undefined,
        tags: undefined,
        passed1: 0,
        passed2: 0,
        failed: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    }).filter(item => item.term && item.meaning)
  }

  const handleExportCSV = () => {
    try {
      const csvContent = [
        'Term,Meaning,Example,Tags,Passed1,Passed2,Failed,Created',
        ...items.map(item => [
          `"${item.term}"`,
          `"${item.meaning}"`,
          `"${item.example || ''}"`,
          `"${item.tags?.join(';') || ''}"`,
          item.passed1,
          item.passed2,
          item.failed,
          new Date(item.createdAt).toISOString().split('T')[0]
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vocab-items-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: 'CSV exported successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export CSV' })
    }
  }

  const handleImportCSV = () => {
    try {
      if (!csvText.trim()) {
        setMessage({ type: 'error', text: 'Please paste CSV data to import' })
        return
      }
      
      const items = parseCSV(csvText)
      importItems(items)
      setMessage({ type: 'success', text: `Imported ${items.length} vocabulary items from CSV!` })
      setCsvText('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid CSV format. Please check your data.' })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Import & Export Data</CardTitle>
              <CardDescription>
                Backup your data or import vocabulary from external sources
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'export' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('export')}
            >
              Export Data
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'import' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('import')}
            >
              Import JSON
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'csv' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('csv')}
            >
              CSV Import/Export
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-md mb-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Export Your Data</h3>
                <p className="text-gray-600 mb-4">
                  Download a complete backup of your vocabulary items, projects, and settings.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Vocabulary Items:</span> {items.length}
                    </div>
                    <div>
                      <span className="font-medium">Projects:</span> {projects.length}
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleExportJSON} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON Backup
                </Button>
              </div>
            </div>
          )}

          {/* Import JSON Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Import JSON Data</h3>
                <p className="text-gray-600 mb-4">
                  Import a complete backup or paste JSON data from another source.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload JSON File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  
                  <div className="text-center text-gray-500">or</div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste JSON Data
                    </label>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Paste your JSON data here..."
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                  
                  <Button onClick={handleImportJSON} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import JSON Data
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* CSV Tab */}
          {activeTab === 'csv' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">CSV Import/Export</h3>
                <p className="text-gray-600 mb-4">
                  Import vocabulary from spreadsheets or export to CSV format.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Export CSV */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Export to CSV</h4>
                    <p className="text-sm text-gray-600">
                      Download your vocabulary items as a CSV file for use in spreadsheet applications.
                    </p>
                    <Button onClick={handleExportCSV} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  {/* Import CSV */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Import from CSV</h4>
                    <p className="text-sm text-gray-600">
                      CSV should have columns: Term, Meaning, Example (optional)
                    </p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileImport}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                </div>
                
                <div className="text-center text-gray-500 my-4">or</div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste CSV Data
                  </label>
                  <textarea
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder="Term,Meaning,Example&#10;hello,a greeting,Hello world&#10;goodbye,a farewell,Goodbye friend"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <Button onClick={handleImportCSV} className="w-full mt-3">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV Data
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
