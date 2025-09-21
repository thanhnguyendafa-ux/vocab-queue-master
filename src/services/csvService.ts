export interface CSVRow {
  Keyword: string
  Tag?: string
  Definition?: string
  Example?: string
  Pronunciation?: string
  ImageURL?: string
}

export interface ImportResult {
  success: boolean
  data: CSVRow[]
  errors: string[]
}

export class CSVService {
  // Parse CSV content to rows
  static parseCSV(content: string): CSVRow[] {
    const lines = content.trim().split('\n')
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row')
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const rows: CSVRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i])
      if (values.length === headers.length) {
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index].trim()
        })
        rows.push(row)
      }
    }

    return rows
  }

  // Parse a single CSV line, handling quoted values
  private static parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i += 2
        } else {
          inQuotes = !inQuotes
          i++
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
        i++
      } else {
        current += char
        i++
      }
    }

    result.push(current)
    return result
  }

  // Generate CSV content from rows
  static generateCSV(rows: CSVRow[]): string {
    if (rows.length === 0) return ''

    const headers = Object.keys(rows[0])
    const csvRows = [
      headers.join(','),
      ...rows.map(row =>
        headers.map(header => {
          const value = row[header as keyof CSVRow] || ''
          return value.includes(',') || value.includes('"') || value.includes('\n')
            ? `"${value.replace(/"/g, '""')}"`
            : value
        }).join(',')
      )
    ]

    return csvRows.join('\n')
  }

  // Validate CSV data against schema
  static validateCSV(rows: CSVRow[], schema: string[]): ImportResult {
    const errors: string[] = []
    const validRows: CSVRow[] = []

    // Required headers
    const requiredHeaders = ['Keyword']
    const headerErrors = requiredHeaders.filter(h => !Object.keys(rows[0] || {}).includes(h))

    if (headerErrors.length > 0) {
      errors.push(`Missing required headers: ${headerErrors.join(', ')}`)
    }

    // Validate each row
    rows.forEach((row, index) => {
      const rowErrors: string[] = []

      // Check required fields
      if (!row.Keyword || row.Keyword.trim() === '') {
        rowErrors.push('Keyword is required')
      }

      // Check schema compliance
      const rowKeys = Object.keys(row)
      const extraHeaders = rowKeys.filter(key => !schema.includes(key) && key !== 'Keyword')
      if (extraHeaders.length > 0) {
        rowErrors.push(`Invalid headers: ${extraHeaders.join(', ')}`)
      }

      if (rowErrors.length === 0) {
        validRows.push(row)
      } else {
        errors.push(`Row ${index + 1}: ${rowErrors.join(', ')}`)
      }
    })

    return {
      success: errors.length === 0,
      data: validRows,
      errors
    }
  }

  // Convert CSV rows to VocabItems
  static csvToVocabItems(csvRows: CSVRow[]): Omit<VocabItem, 'id' | 'failed' | 'passed1' | 'passed2' | 'successRate' | 'inQueue' | 'quitQueue' | 'rankPoint'>[] {
    return csvRows.map(row => ({
      keyword: row.Keyword,
      definition: row.Definition || '',
      example: row.Example,
      pronunciation: row.Pronunciation,
      imageUrl: row.ImageURL,
      tag: row.Tag
    }))
  }
}
