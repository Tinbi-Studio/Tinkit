import type { CalendarEvent } from '@/types/calendar'

function isoForOffset(dayOffset: number): string {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset)
  const month = String(target.getMonth() + 1).padStart(2, '0')
  const day = String(target.getDate()).padStart(2, '0')
  return `${target.getFullYear()}-${month}-${day}`
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Daily Standup Produk',
    date: isoForOffset(0),
    startTime: '09:00',
    endTime: '09:30',
    category: 'meeting',
    color: 'primary',
    location: 'Google Meet',
    attendees: [
      { name: 'Rina Kartika', email: 'rina@studio.io' },
      { name: 'Bima Saputra', email: 'bima@studio.io' },
    ],
    notes: 'Sinkronisasi progres sprint 14 dan blocker desain.',
  },
  {
    id: 'evt-2',
    title: 'Review Desain Dashboard',
    date: isoForOffset(0),
    startTime: '13:30',
    endTime: '14:30',
    category: 'meeting',
    color: 'info',
    location: 'Studio Bandung',
  },
  {
    id: 'evt-3',
    title: 'Deadline Invoice Vendor',
    date: isoForOffset(1),
    startTime: '17:00',
    endTime: '17:00',
    category: 'deadline',
    color: 'error',
  },
  {
    id: 'evt-4',
    title: 'Rilis Tinkit v0.3',
    date: isoForOffset(3),
    startTime: '10:00',
    endTime: '11:00',
    category: 'deadline',
    color: 'warning',
    notes: 'Checklist build, changelog, dan pengumuman komunitas.',
  },
  {
    id: 'evt-5',
    title: 'Wawancara Frontend Engineer',
    date: isoForOffset(4),
    startTime: '14:00',
    endTime: '15:00',
    category: 'meeting',
    color: 'secondary',
    location: 'Zoom',
  },
  {
    id: 'evt-6',
    title: 'Pengingat Perpanjang Domain',
    date: isoForOffset(6),
    startTime: '08:00',
    endTime: '08:15',
    category: 'reminder',
    color: 'accent',
  },
  {
    id: 'evt-7',
    title: 'Offsite Tim Keuangan',
    date: isoForOffset(9),
    startTime: '11:00',
    endTime: '16:00',
    category: 'meeting',
    color: 'success',
    location: 'Dago Coffee',
  },
  {
    id: 'evt-8',
    title: 'Libur Nasional',
    date: isoForOffset(12),
    startTime: '00:00',
    endTime: '23:59',
    category: 'holiday',
    color: 'neutral',
  },
]
