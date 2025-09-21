'use client';
import { __spreadArray } from "tslib";
import * as React from 'react';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';
export function Toaster() {
    var _a = React.useState([]), toasts = _a[0], setToasts = _a[1];
    var toast = React.useCallback(function (_a) {
        var title = _a.title, description = _a.description, _b = _a.variant, variant = _b === void 0 ? 'default' : _b;
        var id = Math.random().toString(36).substring(2, 11);
        setToasts(function (currentToasts) { return __spreadArray(__spreadArray([], currentToasts, true), [
            { id: id, title: title, description: description, variant: variant },
        ], false); });
        return id;
    }, []);
    var dismissToast = React.useCallback(function (id) {
        setToasts(function (currentToasts) {
            return currentToasts.filter(function (toast) { return toast.id !== id; });
        });
    }, []);
    return (<ToastProvider>
      {toasts.map(function (_a) {
            var id = _a.id, title = _a.title, description = _a.description, variant = _a.variant;
            return (<Toast key={id} variant={variant} onOpenChange={function (open) {
                    if (!open)
                        dismissToast(id);
                }}>
          <div className="grid gap-1">
            <ToastTitle>{title}</ToastTitle>
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
        </Toast>);
        })}
      <ToastViewport />
    </ToastProvider>);
}
//# sourceMappingURL=toaster.jsx.map