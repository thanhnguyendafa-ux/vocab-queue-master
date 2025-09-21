import { htmlToImage } from 'dom-to-image'
import { saveAs } from 'file-saver'

export async function exportDashboard(elementId: string, fileName: string) {
  const node = document.getElementById(elementId)
  if (!node) return
  
  try {
    const blob = await htmlToImage.toPng(node)
    saveAs(blob, `${fileName}.png`)
  } catch (error) {
    console.error('Export failed:', error)
  }
}

export function exportDataAsJSON(data: any, fileName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  saveAs(blob, `${fileName}.json`)
}
