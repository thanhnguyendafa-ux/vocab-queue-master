import Papa from 'papaparse'

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}

export function importFromCSV(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => resolve(results.data)
    })
  })
}
