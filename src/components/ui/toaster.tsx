'use client';

import * as React from 'react';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }>>([]);

  const toast = React.useCallback(
    ({
      title,
      description,
      variant = 'default',
    }: {
      title: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      const id = Math.random().toString(36).substring(2, 11);
      setToasts((currentToasts) => [
        ...currentToasts,
        { id, title, description, variant },
      ]);
      return id;
    },
    []
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast
          key={id}
          variant={variant}
          onOpenChange={(open) => {
            if (!open) dismissToast(id);
          }}
        >
          <div className="grid gap-1">
            <ToastTitle>{title}</ToastTitle>
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
