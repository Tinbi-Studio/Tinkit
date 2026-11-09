import type { ColorVariant } from '@/types/theme'

export type KanbanStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
export type KanbanPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface KanbanSubtask {
  id: string
  title: string
  done: boolean
}

export interface KanbanAssignee {
  id: string
  name: string
  role: string
  avatar?: string
  variant?: ColorVariant
}

export interface KanbanTask {
  id: string
  code: string
  title: string
  description: string
  status: KanbanStatus
  priority: KanbanPriority
  category: string
  categoryVariant: ColorVariant
  dueDate: string
  assignees: KanbanAssignee[]
  subtasks: KanbanSubtask[]
  commentsCount: number
  attachmentsCount: number
}

export interface KanbanColumnConfig {
  id: KanbanStatus
  title: string
  variant: ColorVariant
  wipLimit?: number
}
