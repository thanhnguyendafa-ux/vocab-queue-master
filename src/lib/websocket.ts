import { QuizStore } from '../store/useQuizStore'

export function setupAnalyticsWebSocket(store: QuizStore) {
  if (typeof window === 'undefined') return
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const socket = new WebSocket(`${protocol}//${window.location.host}/api/analytics`)
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'SESSION_UPDATE') {
      store.setState({
        sessionHistory: data.sessions,
        items: data.items
      })
    }
  }
  
  return () => socket.close()
}
