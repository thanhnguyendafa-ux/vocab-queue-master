// CSV import/export utilities for Vocab Queue Master

import Papa from 'papaparse'
import { VocabItem } from './models'

export interface CSVRow {
  term: string
  meaning: string
  example?: string
  tags?: string
}

/**
 * Parse CSV data into VocabItem array
 */
export function parseCSV(csvContent: string): Promise<VocabItem[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
          return
        }

        const items: VocabItem[] = results.data
          .filter(row => row.term && row.meaning) // Filter out rows without required fields
          .map((row, index) => ({
            id: `csv_${Date.now()}_${index}`,
            term: row.term.trim(),
            meaning: row.meaning.trim(),
            example: row.example?.trim() || undefined,
            tags: row.tags ? row.tags.split(';').map(tag => tag.trim()).filter(Boolean) : undefined,
            passed1: 0,
            passed2: 0,
            failed: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }))

        resolve(items)
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`))
      }
    })
  })
}

/**
 * Convert VocabItem array to CSV string
 */
export function exportToCSV(items: VocabItem[]): string {
  const csvData = items.map(item => ({
    term: item.term,
    meaning: item.meaning,
    example: item.example || '',
    tags: item.tags ? item.tags.join(';') : ''
  }))

  return Papa.unparse(csvData, {
    header: true,
    columns: ['term', 'meaning', 'example', 'tags']
  })
}

/**
 * Download CSV file
 */
export function downloadCSV(items: VocabItem[], filename = 'vocabulary.csv'): void {
  const csvContent = exportToCSV(items)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = () => reject(new Error('File reading error'))
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * Validate CSV structure
 */
export function validateCSVStructure(csvContent: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  try {
    const result = Papa.parse(csvContent, { header: true, preview: 1 })
    const headers = result.meta.fields || []
    
    const requiredHeaders = ['term', 'meaning']
    const missingHeaders = requiredHeaders.filter(header => 
      !headers.some(h => h.toLowerCase().trim() === header)
    )
    
    if (missingHeaders.length > 0) {
      errors.push(`Missing required columns: ${missingHeaders.join(', ')}`)
    }
    
    if (result.errors.length > 0) {
      errors.push(...result.errors.map(e => e.message))
    }
    
  } catch (error) {
    errors.push(`Invalid CSV format: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Generate sample CSV content
 */
export function generateSampleCSV(): string {
  const sampleData = [
    {
      term: 'abundant',
      meaning: 'existing in large quantities; plentiful',
      example: 'The forest was abundant with wildlife.',
      tags: 'adjective;nature'
    },
    {
      term: 'curious',
      meaning: 'eager to know or learn something',
      example: 'She was curious about how the machine worked.',
      tags: 'adjective;personality'
    },
    {
      term: 'determine',
      meaning: 'to decide or establish exactly',
      example: 'We need to determine the best route to take.',
      tags: 'verb;decision'
    },
    {
      term: 'enormous',
      meaning: 'very large in size or quantity',
      example: 'The elephant was enormous compared to the mouse.',
      tags: 'adjective;size'
    },
    {
      term: 'fragile',
      meaning: 'easily broken or damaged',
      example: 'Handle the glass vase carefully because it is fragile.',
      tags: 'adjective;physical'
    }
  ]
  
  return Papa.unparse(sampleData, {
    header: true,
    columns: ['term', 'meaning', 'example', 'tags']
  })
}
