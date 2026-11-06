import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ToastItem } from '@/types/toast'

export const useToastStore = defineStore('tinkit-toast', () => {
  const toasts = ref<ToastItem[]>([])

  function add(toast: Omit<ToastItem, 'id'>): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const duration = toast.duration ?? 4000

    const item: ToastItem = {
      ...toast,
      id,
      duration,
    }

    toasts.value.push(item)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(title: string, message?: string, duration?: number) {
    return add({ title, message, variant: 'success', duration })
  }

  function error(title: string, message?: string, duration?: number) {
    return add({ title, message, variant: 'error', duration })
  }

  function warning(title: string, message?: string, duration?: number) {
    return add({ title, message, variant: 'warning', duration })
  }

  function info(title: string, message?: string, duration?: number) {
    return add({ title, message, variant: 'info', duration })
  }

  function primary(title: string, message?: string, duration?: number) {
    return add({ title, message, variant: 'primary', duration })
  }

  function clearAll() {
    toasts.value = []
  }

  return {
    toasts,
    add,
    remove,
    success,
    error,
    warning,
    info,
    primary,
    clearAll,
  }
})

// Shortcut composable
export function useToast() {
  return useToastStore()
}
