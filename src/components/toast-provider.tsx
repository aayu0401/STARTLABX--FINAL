'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, 'id'>) => void;
    hideToast: (id: string) => void;
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const duration = toast.duration || 5000;
        const newToast: Toast = {
            ...toast,
            id,
            duration,
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((title: string, description?: string) => {
        showToast({ type: 'success', title, description });
    }, [showToast]);

    const error = useCallback((title: string, description?: string) => {
        showToast({ type: 'error', title, description });
    }, [showToast]);

    const info = useCallback((title: string, description?: string) => {
        showToast({ type: 'info', title, description });
    }, [showToast]);

    const warning = useCallback((title: string, description?: string) => {
        showToast({ type: 'warning', title, description });
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} onClose={hideToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
        warning: AlertTriangle,
    };

    const Icon = icons[toast.type];

    const colors = {
        success: 'bg-green-500/10 border-green-500/20 text-green-600',
        error: 'bg-red-500/10 border-red-500/20 text-red-600',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
        warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600',
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-blue-500',
        warning: 'text-yellow-500',
    };

    return (
        <div
            className={cn(
                "pointer-events-auto glass border rounded-lg p-4 shadow-lg animate-slide-in-right",
                colors[toast.type]
            )}
        >
            <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconColors[toast.type])} />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{toast.title}</p>
                    {toast.description && (
                        <p className="text-xs text-muted-foreground mt-1">{toast.description}</p>
                    )}
                </div>
                <button
                    onClick={() => onClose(toast.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
