// app/components/Toast.tsx
'use client';

import { useEffect } from 'react';
import styles from './Toast.module.css';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

interface SingleToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const SingleToast = ({ toast, onRemove }: SingleToastProps) => {
  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]}`}
      onClick={() => onRemove(toast.id)}
    >
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>{getIcon()}</span>
        <span className={styles.toastMessage}>{toast.message}</span>
      </div>
      <button 
        className={styles.toastClose} 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <SingleToast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}