'use client'

import * as React from 'react'

type Toast = {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

type ToastContextType = {
  toast: (toast: Toast) => string
  dismissToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<Toast & { id: string }>>([])

  const toast = React.useCallback(({ title, description, variant }: Toast) => {
    const id = Math.random().toString(36).substring(2, 11)
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, variant }
    ])
    return id
  }, [])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 flex flex-col space-y-2 p-4">
        {toasts.map(({ id, title, description, variant = 'default' }) => (
          <div
            key={id}
            className={`flex items-center justify-between rounded-md p-4 shadow-lg ${
              variant === 'destructive'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            <div>
              <p className="font-medium">{title}</p>
              {description && <p className="text-sm opacity-90">{description}</p>}
            </div>
            <button
              onClick={() => dismissToast(id)}
              className="ml-4 text-lg font-bold opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
