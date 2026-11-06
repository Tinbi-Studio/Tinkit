import type { ColorVariant } from '@/types/theme'

export type CalendarCategory = 'meeting' | 'deadline' | 'reminder' | 'holiday'

export interface CalendarAttendee {
  name: string
  email: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  category: CalendarCategory
  color: ColorVariant
  location?: string
  attendees?: CalendarAttendee[]
  notes?: string
}
